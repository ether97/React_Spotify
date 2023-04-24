const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const cors = require("cors");
const connection = require("./config/db");
const {
  registerUser,
  loginUser,
  searchForSong,
  getFavorites,
  getArtists,
  getFollowers,
  addSong,
  deleteFavorites,
  followArtists,
  mySongs,
  createSong,
} = require("./controllers/UserControllers");
const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
const { authMiddleware } = require("./middleware/authMiddleware");

require("dotenv").config({ path: path.join(__dirname, "./.env") });
const PORT = process.env.PORT || 5000;

app.post("/user/register", registerUser);
app.post("/user/login", loginUser);
app.use(cookieParser());
app.post("/user/songs/search", searchForSong);
app.get("/user/likedSongs", authMiddleware, getFavorites);
app.get("/user/artists", authMiddleware, getArtists);
app.post("/user/song/like", authMiddleware, addSong);
app.get("/user/followers", authMiddleware, getFollowers);
app.post("/user/songs/dislike", authMiddleware, deleteFavorites);
app.post("/user/follow", authMiddleware, followArtists);
app.get("/user/mySongs", authMiddleware, mySongs);
app.post("/user/createSong", authMiddleware, createSong);

connection.once("open", () => {
  app.listen(PORT, (req, res) => {
    console.log(`Server listening on port: ${PORT}`);
  });
});
