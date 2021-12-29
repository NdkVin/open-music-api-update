const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'name harus berupa string',
    'string.empty': 'name tidak boleh kosong',
    'any.required': 'name harus diisi',
  }),
  year: Joi.number().required().messages({
    'number.base': 'year harus berupa number',
    'number.empty': 'year tidak boleh kosong',
    'any.required': 'year harus diisi',
  }),
});

module.exports = { AlbumPayloadSchema };
