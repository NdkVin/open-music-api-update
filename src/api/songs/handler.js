const ClientError = require('../../exceptions/ClientError');

/* eslint-disable class-methods-use-this */
class SongsHandler {
  constructor(service, validator) {
    this._services = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongbyIdHandler = this.putSongbyIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  // post song
  async postSongHandler({ payload }, h) {
    try {
      this._validator.validateSongPayload(payload);
      const songId = await this._services.addSong(payload);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (e) {
      if (e instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: e.message,
        });
        response.code(e.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'terjadi kesalahan di server',
      });
      console.log(e);
      response.code(500);
      return response;
    }
  }

  // get all songs
  async getSongsHandler({ query },h) {
    try {
      const { title, performer } = query;

      let songs = await this._services.getSongs(query);

      if (!title && performer) {
        songs = await this._services.searchSongByPerformer(performer);
      }

      if (title && !performer) {
        songs = await this._services.searchSongByTitle(title);
      }

      if (title && performer) {
        songs = await this._services.searchSongByPerformerAndTitle(performer, title);
      }
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (e) {
      if (e instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: e.message,
        });
        response.code(e.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'terjadi kesalahan di server',
      });
      console.log(e);
      response.code(500);
      return response;
    }
  }

  // get song by id
  async getSongByIdHandler({ params }, h) {
    try {
      const { songId } = params;
      const song = await this._services.getSongById(songId);

      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (e) {
      if (e instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: e.message,
        });
        response.code(e.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'terjadi kesalahan di server',
      });
      console.log(e);
      response.code(500);
      return response;
    }
  }

  // put song by id
  async putSongbyIdHandler({ params, payload }, h) {
    try {
      const { songId } = params;
      this._validator.validateSongPayload(payload);

      await this._services.editSongById(songId, payload);
      return {
        status: 'success',
        message: 'lagu berhasil diperbarui',
      };
    } catch (e) {
      if (e instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: e.message,
        });
        response.code(e.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'terjadi kesalahan di server',
      });
      console.log(e);
      response.code(500);
      return response;
    }
  }

  async deleteSongByIdHandler({ params }, h) {
    try {
      await this._services.deleteSongById(params);
      return {
        status: 'success',
        message: 'lagu berhasil dihapus',
      };
    } catch (e) {
      if (e instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: e.message,
        });
        response.code(e.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'terjadi kesalahan di server',
      });
      console.log(e);
      response.code(500);
      return response;
    }
  }
}

module.exports = SongsHandler;
