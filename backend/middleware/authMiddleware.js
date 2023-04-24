const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log("token", token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(decoded);
    req.id = decoded.id;
    next();
  } catch (error) {
    res.send({ message: "token expired!" });
  }
};

module.exports = { authMiddleware };
