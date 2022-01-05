const mapDbToModel = ({ album_id, ...args }) => ({
  ...args,
  albumId: album_id,
});

module.exports = { mapDbToModel };
