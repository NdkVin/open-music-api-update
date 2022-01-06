const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum(payload) {
    const id = `album-${nanoid(16)}`;
    const { name, year } = payload;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, year, null],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('tidak dapat menambahkan album');
    }

    const { id: albumId } = result.rows[0];

    return albumId;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('album tidak ditemukan');
    }

    return result.rows[0];
  }

  async editAlbum(payload, params) {
    const { name, year } = payload;
    const { id } = params;

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('album tidak ditemukan');
    }
  }

  async deleteAlbumById(params) {
    const { id } = params;

    const query = {
      text: 'DELETE FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Tidak dapat menghapus album, album tidak ditemukan');
    }
  }

  async updateAlbumCover(filename, id) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2',
      values: [filename, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('tidak dapat menambahkan gambar');
    }
  }
}

module.exports = AlbumService;
