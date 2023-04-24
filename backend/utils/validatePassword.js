const validatePassword = (password) => {
  var passwordFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (password.match(passwordFormat)) {
    return true;
  }
  return false;
};

module.exports = validatePassword;
