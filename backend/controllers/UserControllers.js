const Song = require("../models/Song");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateEmail = require("../utils/validateEmail");
const validatePassword = require("../utils/validatePassword");

const registerUser = async (req, res) => {
  const { email, password, username, role } = req.body;
  console.log(role);

  if (!email || !password || !username || !role) {
    return res.send("Must fill out all fields!");
  }

  //email validation:
  if (!validateEmail(email)) {
    console.log(2);
    return res.send("invalid email!");
  }

  //password validation:
  if (!validatePassword(password)) {
    console.log(3);
    return res.send("invalid password!");
  }

  const userExists = await User.findOne({ email });
  console.log(5);

  //check if user already exists:
  if (userExists) {
    console.log(6);
    return res.send("user already exists!");
  }

  //hash password:
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(7);

  //create user:
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });
  console.log(7);

  //generate token:
  let token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: "10h",
  });
  console.log(token);
  console.log(user);

  //send token in response:
  return res.cookie("token", token, { maxAge: 36000000000 }).send({
    message: "success",
    user: user,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string")
    console.log("not strings");
  // res.send("invalid input");
  console.log("hi");
  //email validation:
  if (!validateEmail(email)) res.send("invalid email!");

  //password validation:
  if (!validatePassword(password)) res.send("invalid password!");

  const user = await User.findOne({ email });

  //check if user exists:
  if (!user) res.send("user does not exist!");

  //compare input password and db password:
  if (!(await bcrypt.compare(password, user.password))) {
    res.send("incorrect password!");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    let token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "10h",
    });
    console.log(token);
    //send token in response:
    res.cookie("token", token, { maxAge: 36000000000 }).send({
      message: "success",
      user: user,
    });
  }
  //generate token:
};

const addSong = async (req, res) => {
  const { title } = req.body;
  const _id = req.id;
  const user = await User.findOne({ _id });
  const likedSongs = user.likedSongs;
  const song = await Song.findOne({ title });
  if (!likedSongs.includes(song._id)) {
    await User.findByIdAndUpdate(
      _id,
      {
        $push: { likedSongs: song._id },
      },
      { new: true }
    );
    res.send({ message: "success" });
  } else {
    res.send({ message: "failure" });
  }
};

const searchForSong = async (req, res) => {
  const { search, language, artist } = req.body;
  console.log(req.body);
  const _id = req.id;
  console.log(req.body);
  const song = await Song.find({
    $or: [{ title: search }, { language: language }, { artist: artist }],
  });
  if (song) {
    const newSongs = song.map((item) => ({
      artist: item.artist,
      title: item.title,
      picture: item.picture,
    }));
    res.send({
      message: "success",
      song: newSongs,
    });
  } else {
    res.send({
      message: "cannot find song!",
    });
  }
};

const getFavorites = async (req, res) => {
  const _id = req.id;
  const user = await User.findOne({ _id });
  const newUser = await user.populate("likedSongs");
  const songs = newUser.likedSongs;
  console.log(songs);
  res.send(songs);
};

const getArtists = async (req, res) => {
  const _id = req.id;
  const user = await User.findOne({ _id });
  const username = user.username;
  const artists = await User.find({ role: "artist" });
  let newArtists = artists.map((artist) => ({
    username: artist.username,
  }));
  newArtists = newArtists.filter((artist) => artist.username !== username);
  res.send(newArtists);
};

const getFollowers = async (req, res) => {
  const _id = req.id;
  const user = await User.findOne({ _id });
  console.log("check", user);
  const newUser = await user.populate("followers");
  const followers = newUser.followers;
  console.log(followers);
  console.log(followers);
  res.send(followers);
};

const deleteFavorites = async (req, res) => {
  const _id = req.id;
  const { songs } = req.body;
  for (let i = 0; i < songs.length; i++) {
    const title = songs[i];
    const song = await Song.findOne({ title });
    await User.findOneAndUpdate(
      { _id: _id },
      {
        $pull: { likedSongs: song._id },
      },
      { safe: true, multi: false }
    );
  }
  res.send({ message: "success" });
};

const followArtists = async (req, res) => {
  const _id = req.id;
  const { username } = req.body;
  const user = await User.findOne({ username });
  const followers = user.followers;
  if (!followers.includes(_id)) {
    await User.findByIdAndUpdate(
      user._id,
      {
        $push: { followers: _id },
      },
      { new: true }
    );
    res.send({ message: "success" });
  } else {
    res.send({ message: "fail" });
  }
};

const mySongs = async (req, res) => {
  const _id = req.id;
  const user = await User.findOne({ _id });
  const newUser = await user.populate("createdSongs");
  const createdSongs = newUser.createdSongs;
  if (createdSongs.length > 0) {
    res.send({
      message: "success",
      songs: createdSongs,
    });
  } else {
    res.send({ message: "fail" });
  }
};

const createSong = async (req, res) => {
  const _id = req.id;
  const {
    picture,
    title,
    album,
    date,
    language,
    runtime,
    liked,
    genre,
    artist,
  } = req.body.song;
  const user = await User.findOne({ _id });
  const newSong = await Song.create({
    picture,
    title,
    album,
    date,
    language,
    runtime,
    liked,
    genre,
    artist,
  });
  console.log("new song", newSong);
  const newSongID = newSong._id;
  const createdSongs = user.createdSongs;
  if (!createdSongs.includes(newSongID)) {
    await User.findByIdAndUpdate(
      user._id,
      {
        $push: { createdSongs: newSongID },
      },
      { new: true }
    );
    res.send({ message: "success" });
  } else {
    res.send({ message: "fail" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  searchForSong,
  addSong,
  getFavorites,
  getArtists,
  getFollowers,
  deleteFavorites,
  followArtists,
  mySongs,
  createSong,
};
