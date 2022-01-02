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
  }

  async getAlbumByIdHandler({ params }) {
    const { id } = params;

    const album = await this._service.getAlbumById(id);

    const songs = await this._songService.getSongsByAlbum(id);

    if (songs.rowCount) {
      album.songs = songs.rows;
      console.log(songs);
    }

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler({ params, payload }) {
    this._validator.validateAlbumPayload(payload);

    await this._service.editAlbum(payload, params);
    return {
      status: 'success',
      message: 'berhasil mengupdate album',
    };
  }

  async deleteAlbumByIdHandler({ params }) {
    await this._service.deleteAlbumById(params);
    return {
      status: 'success',
      message: 'berhasil menghapus album',
    };
  }
}

module.exports = AlbumsHandler;
