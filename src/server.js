require('dotenv').config();

const Hapi = require('@hapi/hapi');

// eslint-disable-next-line import/extensions
// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');
// songs
const songs = require('./api/songs');
const SongsServices = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const songsServices = new SongsServices();
  const albumsService = new AlbumsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
        songService: songsServices,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsServices,
        validator: SongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server sedang berjalan pada ${server.info.uri}`);
};

init();
