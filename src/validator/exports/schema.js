const Joi = require('joi');

const ExportPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required().messages({
    'string.base': 'email harus berupa string',
    'email.base': 'email tidak valid',
    'string.empty': 'email tidak boleh kosong',
    'any.required': 'email harus diisi',
  }),
});

module.exports = { ExportPayloadSchema };
