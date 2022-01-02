class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator, usersService) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
    this._usersService = usersService;

    this.postCollaborationsHandler = this.postCollaborationsHandler.bind(this);
    this.deleteCollaborationsHandler = this.deleteCollaborationsHandler.bind(this);
  }

  async postCollaborationsHandler({ payload, auth }, h) {
    this._validator.validateCollaborationPayload(payload);

    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(payload.playlistId, credentialId);
    await this._usersService.verifyUserId(payload.userId);
    const collaborationId = await this._collaborationsService.addColaboration(payload);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationsHandler({ payload, auth }) {
    this._validator.validateCollaborationPayload(payload);

    const { id: credentialId } = auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(payload.playlistId, credentialId);
    await this._collaborationsService.deleteColaboration(payload);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
