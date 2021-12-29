/* eslint-disable camelcase */
const mapDbToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
  albumId: album_id,
});

module.exports = { mapDbToModel };
