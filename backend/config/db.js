require("dotenv").config();
const mongoose = require("mongoose");
const { MONGO_URL } = process.env;

mongoose
  .connect(MONGO_URL, {
    dbName: "React_Spotify",
  })
  .then(() => console.log("Connected to DB"));

const connection = mongoose.connection;

module.exports = connection;
