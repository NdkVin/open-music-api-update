class PlaylistsHandler {
  constructor(service, validator, songsServices, playlistsongactivities) {
    this._service = service;
    this._validator = validator;
    this._songService = songsServices;
    this._playlistsongactivities = playlistsongactivities;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsOnPlaylistHandler = this.getSongsOnPlaylistHandler.bind(this);
    this.deleteSongsOnPlaylistHandler = this.deleteSongsOnPlaylistHandler.bind(this);
    this.getPlaylistActivityHandler = this.getPlaylistActivityHandler.bind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    this._validator.validatePlaylistPayload(payload);
    const { id: credentialId } = auth.credentials;
    const { name } = payload;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler({ auth }) {
    const { id: credentialId } = auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler({ params, auth }) {
    const { playlistId } = params;
    const { id: credentialId } = auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler({ payload, params, auth }, h) {
    this._validator.validatePostSongToPayload(payload);

    const { playlistId } = params;
    const { id: credentialId } = auth.credentials;
    const { songId } = payload;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._songService.getSongById(songId);
    await this._service.addSongToPlaylist(playlistId, songId);
    await this._playlistsongactivities.addActivity(playlistId, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsOnPlaylistHandler({ params, auth }) {
    const { id: credentialId } = auth.credentials;
    const { playlistId } = params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const { id, name, username } = await this._service.getPlaylistById(playlistId);
    const songs = await this._service.getSongsPlaylist(playlistId);
    return {
      status: 'success',
      data: {
        playlist: {
          id,
          name,
          username,
          songs,
        },
      },
    };
  }

  async deleteSongsOnPlaylistHandler({ payload, params, auth }) {
    this._validator.validateDeleteSongsOnPayload(payload);

    const { songId } = payload;
    const { playlistId } = params;
    const { id: credentialId } = auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongsOnPlaylist(songId, playlistId);
    await this._playlistsongactivities.addActivity(playlistId, songId, credentialId, 'delete');
    return {
      status: 'success',
      message: 'lagu berhasil dihapus dari palylist',
    };
  }

  async getPlaylistActivityHandler({ params, auth }) {
    const { id: playlistId } = params;
    const { id: credentialId } = auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const activities = await this._playlistsongactivities.getActivityByPlaylistId(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
