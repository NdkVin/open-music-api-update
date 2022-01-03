/* eslint-disable max-len */
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, {
    service, validator, songsServices, playlistsongactivities,
  }) => {
    const playlistHandler = new PlaylistsHandler(service, validator, songsServices, playlistsongactivities);
    server.route(routes(playlistHandler));
  },
};
