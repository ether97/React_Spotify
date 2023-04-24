const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  follows: [{ type: String, required: true }],
  followers: [{ type: refType, ref: "User" }],
  likedSongs: [{ type: refType, ref: "Song" }],
  createdSongs: [{ type: refType, ref: "Song" }],
});

const User = mongoose.model("User", UserSchema, "Users");

module.exports = User;
