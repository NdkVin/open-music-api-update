const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'nama token harus berupa string',
    'string.empty': 'nama token tidak boleh kosong',
    'any.required': 'nama token harus diisi',
  }),
});

const PostSongToPlaylistSchema = Joi.object({
  songId: Joi.string().required().messages({
    'string.base': 'song id token harus berupa string',
    'string.empty': 'song id token tidak boleh kosong',
    'any.required': 'song id token harus diisi',
  }),
});

const DeleteSongsOnPlaylistSchema = Joi.object({
  songId: Joi.string().required().messages({
    'string.base': 'song id token harus berupa string',
    'string.empty': 'song id token tidak boleh kosong',
    'any.required': 'song id token harus diisi',
  }),
});

module.exports = {
  PlaylistPayloadSchema,
  PostSongToPlaylistSchema,
  DeleteSongsOnPlaylistSchema,
};
