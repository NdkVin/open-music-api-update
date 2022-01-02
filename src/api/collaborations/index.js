/* eslint-disable max-len */
const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    collaborationsService, playlistsService, validator, usersService,
  }) => {
    const playlistHandler = new CollaborationsHandler(collaborationsService, playlistsService, validator, usersService);
    server.route(routes(playlistHandler));
  },
};
