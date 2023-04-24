const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  picture: { type: String, required: true },
  title: { type: String, required: true },
  language: { type: String, required: true },
  album: { type: String, required: true },
  date: { type: String, required: true },
  runtime: { type: String, required: true },
  liked: { type: Boolean, required: true },
  genre: { type: String, required: true },
  artist: { type: String, required: true },
});

const Song = mongoose.model("Song", SongSchema, "Songs");

module.exports = Song;
