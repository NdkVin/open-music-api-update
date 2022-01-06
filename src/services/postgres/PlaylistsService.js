const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AutorizationError');

class PlaylistService {
  constructor(collaborationsService, cacheService) {
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('tidak dapat menambahkan playliust');
    }
    await this._cacheService.delete(`playlist:${owner}`);
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    try {
      const result = await this._cacheService.get(`playlist:${owner}`);
      return JSON.parse(result);
    } catch {
      const query = {
        text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner=users.id LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id WHERE playlists.owner = $1 OR collaborations.user_id = $1',
        values: [owner],
      };

      const result = await this._pool.query(query);

      const cache = {
        source: 'cache',
        data: {
          playlists: result.rows,
        },
      };

      await this._cacheService.set(`playlist:${owner}`, JSON.stringify(cache));
      return result.rows;
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING owner',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const { owner } = result.rows[0];
    await this._cacheService.delete(`playlist:${owner}`);
  }

  async addSongToPlaylist(playlistId, songId) {
    await this._cacheService.delete(`songs:${playlistId}`);
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) returning id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('tidak dapat menambahkan lagu ke playlist');
    }

    return result;
  }

  async getSongsPlaylist(playlistId) {
    try {
      const result = await this._cacheService.get(`songs:${playlistId}`);
      return JSON.parse(result);
    } catch {
      const query = {
        text: 'SELECT songs.id, songs.title, songs.performer FROM playlists INNER JOIN playlistsongs ON playlists.id = playlistsongs.playlist_id INNER JOIN songs ON songs.id = playlistsongs.song_id WHERE playlists.id = $1',
        values: [playlistId],
      };

      const result = await this._pool.query(query);
      const cache = {
        source: 'cache',
        data: {
          songs: result.rows,
        },
      };

      await this._cacheService.set(`songs:${playlistId}`, JSON.stringify(cache));
      return result.rows;
    }
  }

  async deleteSongsOnPlaylist(songId, playlistId) {
    await this._cacheService.delete(`songs:${playlistId}`);
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Tidak dapat menghapus lagu dari playlist');
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists where id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak melakukan ini');
    }
  }

  async verifyPlaylistAccess(playlistId, owner) {
    try {
      await this.verifyPlaylistOwner(playlistId, owner);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e;
      }

      try {
        await this._collaborationsService.verifyCollaboration(playlistId, owner);
      } catch {
        throw e;
      }
    }
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('playlist tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = PlaylistService;
