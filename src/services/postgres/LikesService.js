/* eslint-disable no-else-return */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class LikesService {
  constructor() {
    this._pool = new Pool();
  }

  async likeAlbums(albumId, userId) {
    const query = {
      text: 'SELECT * from user_album_likes where album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      const res = await this.like(albumId, userId);
      return res;
    } else {
      const res = await this.unlike(albumId, userId);
      return res;
    }
  }

  async like(albumId, userId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3)',
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('tidak bisa like');
    }

    return 'like';
  }

  async unlike(albumId, userId) {
    const query = {
      text: 'DELETE from user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('tidak bisa unlike');
    }

    return 'unlike';
  }

  async countLikesAlbum(albumId) {
    const query = {
      text: 'SELECT * from user_album_likes where album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }
}

module.exports = LikesService;
