const InvariantError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema, ImageHeadersSchema } = require('./schema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validateResult = AlbumPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
  validateImageHeaders: (payload) => {
    const validateResult = ImageHeadersSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
