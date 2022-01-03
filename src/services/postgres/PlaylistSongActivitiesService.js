const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class Playlistsongactivities {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlistsongactivities VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Tidak dapat menambahkan playlistsongactivities');
    }
  }

  async getActivityByPlaylistId(id) {
    const query = {
      text: 'SELECT users.username, songs.title, playlistsongactivities.action, playlistsongactivities.time FROM playlistsongactivities LEFT JOIN users ON playlistsongactivities.user_id = users.id LEFT JOIN songs ON playlistsongactivities.song_id = songs.id WHERE playlistsongactivities.playlist_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = Playlistsongactivities;
