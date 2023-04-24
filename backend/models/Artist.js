const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const refType = mongoose.Types.ObjectId;

const ArtistSchema = new Schema({
  picture: { type: String, required: true },
  name: { type: String, required: true },
  songs: [{ type: refType, ref: "Song" }],

  followers: [{ type: refType, ref: "User" }],
});

const Artist = mongoose.model("Artist", ArtistSchema, "Artists");

module.exports = Artist;
