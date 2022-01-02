const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { service, validator, songsServices }) => {
    const playlistHandler = new PlaylistsHandler(service, validator, songsServices);
    server.route(routes(playlistHandler));
  },
};
