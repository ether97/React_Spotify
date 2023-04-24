const validateEmail = (email) => {
  var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(emailFormat)) {
    return true;
  }
  return false;
};

module.exports = validateEmail;
