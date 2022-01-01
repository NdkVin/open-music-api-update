/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      noNull: true,
    },
    year: {
      type: 'INTEGER',
      noNull: true,
    },
    performer: {
      type: 'TEXT',
      noNull: true,
    },
    genre: {
      type: 'TEXT',
      noNull: true,
    },
    duration: {
      type: 'INTEGER',
    },
    album_id: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
