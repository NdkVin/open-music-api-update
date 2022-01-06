class AlbumsHandler {
  constructor(service, validator, songService, storageService) {
    this._service = service;
    this._validator = validator;
    this._songService = songService;
    this._storageService = storageService;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postAlbumCover = this.postAlbumCover.bind(this);
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

    const {
      id: albumId, name, year, cover_url,
    } = await this._service.getAlbumById(id);

    const songs = await this._songService.getSongsByAlbum(id);
    const album = {
      id: albumId,
      name,
      year,
      coverUrl: cover_url,
    };

    if (songs.length) {
      album.songs = songs;
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

  async postAlbumCover({ payload, params }, h) {
    const { cover } = payload;
    await this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`;
    await this._service.updateAlbumCover(fileLocation, params.id);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
