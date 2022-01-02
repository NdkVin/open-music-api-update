class UsersHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler({ payload }, h) {
    this._validator.validateUserPayload(payload);

    const { username, password, fullname } = payload;
    const userId = await this._services.addUser(username, password, fullname);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
