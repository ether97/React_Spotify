const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  searchForSong,
  getFavorites,
  getArtists,
  getFollowers,
  addSong,
  deleteFavorites,
} = require("../controllers/UserControllers");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/songs/search", searchForSong);
router.get("/likedSongs", authMiddleware, getFavorites);
router.get("/artists", getArtists);
router.post("/song/like", authMiddleware, addSong);
router.get("/followers", authMiddleware, getFollowers);
router.post("/songs/dislike", authMiddleware, deleteFavorites);

module.exports = router;
