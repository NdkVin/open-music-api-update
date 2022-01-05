/* eslint-disable lines-between-class-members */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDbToModel } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  // add song
  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan data');
    }

    return result.rows[0].id;
  }

  // get all songs
  async getSongs() {
    const songs = await this._pool.query('SELECT id, title, performer FROM songs');
    return songs.rows;
  }

  async searchSongByTitle(title) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER($1)',
      values: [`${title}%`],
    };

    const songs = await this._pool.query(query);
    return songs.rows;
  }

  async searchSongByPerformer(performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE LOWER($1)',
      values: [`${performer}%`],
    };

    const songs = await this._pool.query(query);
    return songs.rows;
  }

  async searchSongByPerformerAndTitle(performer, title) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE LOWER($1) AND LOWER(title) LIKE LOWER($2)',
      values: [`${performer}%`, `${title}%`],
    };

    const songs = await this._pool.query(query);
    return songs.rows;
  }

  // get song by id
  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };

    const song = await this._pool.query(query);

    if (!song.rowCount) {
      throw new NotFoundError('Song not found');
    }
    return song.rows.map(mapDbToModel)[0];
  }
  // id, title, year, performer, genre, duration, albumId
  async editSongById(songId, payload) {
    const {
      title, year, performer, genre, duration, albumId,
    } = payload;
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Data gagal diperbarui');
    }
  }

  // delete song by id
  async deleteSongById({ songId }) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus, id tidak ditemukan');
    }
  }

  async getSongsByAlbum(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = SongsService;
