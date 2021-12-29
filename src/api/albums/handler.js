const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(service, validator, songService) {
    this._service = service;
    this._validator = validator;
    this._songService = songService;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler({ payload }, h) {
    try {
      this._validator.validateAlbumPayload(payload);

      const albumId = await this._service.addAlbum(payload);

      const response = h.response({
        status: 'success',
        data: {
          albumId,
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

  async getAlbumByIdHandler({ params }, h) {
    try {
      const { id } = params;

      const album = await this._service.getAlbumById(id);

      const songs = await this._songService.getSongsByAlbum(id);

      if (songs.rowCount) {
        album.songs = songs.rows;
      }

      return {
        status: 'success',
        data: {
          album,
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

  async putAlbumByIdHandler({ params, payload }, h) {
    try {
      this._validator.validateAlbumPayload(payload);

      await this._service.editSong(payload, params);
      return {
        status: 'success',
        message: 'berhasil mengupdate album',
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

  async deleteAlbumByIdHandler({ params }, h) {
    try {
      await this._service.deleteAlbumById(params);
      return {
        status: 'success',
        message: 'berhasil menghapus album',
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

module.exports = AlbumsHandler;
