const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.base': 'username harus berupa string',
    'string.empty': 'usernmae tidak boleh kosong',
    'any.required': 'username harus diisi',
  }),
  password: Joi.string().required().messages({
    'string.base': 'password harus berupa string',
    'string.empty': 'password tidak boleh kosong',
    'any.required': 'password harus diisi',
  }),
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.base': 'refresh token harus berupa string',
    'string.empty': 'refresh token tidak boleh kosong',
    'any.required': 'refresh token harus diisi',
  }),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.base': 'refresh token harus berupa string',
    'string.empty': 'refresh token tidak boleh kosong',
    'any.required': 'refresh token harus diisi',
  }),
});

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
