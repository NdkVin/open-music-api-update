const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'title harus berupa string',
    'string.empty': 'title tidak boleh kosong',
    'any.required': 'title harus diisi',
  }),
  year: Joi.number().min(1900).max(2020).required()
    .messages({
      'number.base': 'name harus berupa number',
      'number.empty': 'name tidak boleh kosong',
      'any.required': 'name harus diisi',
    }),
  performer: Joi.string().required().messages({
    'string.base': 'performer harus berupa string',
    'string.empty': 'performer tidak boleh kosong',
    'any.required': 'performer harus diisi',
  }),
  genre: Joi.string().required().messages({
    'string.base': 'genre harus berupa string',
    'string.empty': 'genre tidak boleh kosong',
    'any.required': 'genre harus diisi',
  }),
  duration: Joi.number().messages({
    'number.base': 'duration harus berupa number',
    'number.empty': 'duration tidak boleh kosong',
  }),
  albumId: Joi.string().messages({
    'number.base': 'albumId harus berupa number',
    'number.empty': 'albumId tidak boleh kosong',
  }),
});

module.exports = { SongPayloadSchema };
