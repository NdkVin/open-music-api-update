/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      noNull: true,
    },
    year: {
      type: 'INTEGER',
      noNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
