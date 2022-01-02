const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required().messages({
    'string.base': 'playlist id token harus berupa string',
    'string.empty': 'playlist id token tidak boleh kosong',
    'any.required': 'plsylist id token harus diisi',
  }),
  userId: Joi.string().required().messages({
    'string.base': 'user id token harus berupa string',
    'string.empty': 'user id token tidak boleh kosong',
    'any.required': 'user id token harus diisi',
  }),
});

module.exports = { CollaborationPayloadSchema };
