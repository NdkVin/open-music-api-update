class LikesHandler {
  constructor(likesService, albumsService) {
    this._likesService = likesService;
    this._albumsService = albumsService;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.getLikeCountHandler = this.getLikeCountHandler.bind(this);
  }

  async postLikeHandler({ auth, params }, h) {
    const { id: credentialId } = auth.credentials;
    await this._albumsService.getAlbumById(params.id);

    const result = await this._likesService.likeAlbums(params.id, credentialId);

    if (result === 'like') {
      const response = h.response({
        status: 'success',
        message: 'berhasil like album',
      });
      response.code(201);
      return response;
    }

    const response = h.response({
      status: 'success',
      message: 'berhasil unlike album',
    });
    response.code(201);
    return response;
  }

  async getLikeCountHandler({ params }) {
    await this._albumsService.getAlbumById(params.id);

    const likes = await this._likesService.countLikesAlbum(params.id);

    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }
}

module.exports = LikesHandler;
