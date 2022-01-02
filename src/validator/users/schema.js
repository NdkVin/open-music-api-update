const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.base': 'username harus berupa string',
    'string.empty': 'username tidak boleh kosong',
    'any.required': 'username harus diisi',
  }),
  password: Joi.string().required().messages({
    'string.base': 'password harus berupa string',
    'string.empty': 'password tidak boleh kosong',
    'any.required': 'password harus diisi',
  }),
  fullname: Joi.string().required().messages({
    'string.base': 'fullname harus berupa string',
    'string.empty': 'fullname tidak boleh kosong',
    'any.required': 'fullname harus diisi',
  }),
});

module.exports = { UserPayloadSchema };
