const User = require('../models/user');
const Blacktoken = require('../models/blacktoken');

function verifyUser(username) {
  // TODO: Use find instead of findOne for performance purposes
  return User.findOne({ username });
}

function authenticateUser(username, password) {
  return verifyUser(username).then(
  (user) => {
    if (!user) {
      return Promise.reject({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user.password !== password) {
      return Promise.reject({ success: false, message: 'Authentication failed. Wrong password.' });
    }
    return Promise.resolve(user);
  },
  err => err);
}
exports.authenticateUser = authenticateUser;

function createUser(username, password, admin) {
  // Create a sample user
  const newUser = new User({
    username,
    // Security flaw (beyond the obvious hard-coded stupid password):
    // passwords should be encrypted, using bcrypt for example
    password,
    admin,
  });

  // Save the sample user
  return newUser.save();
}
exports.createUser = createUser;

function invalidateToken(token) {
  const newBlacktoken = new Blacktoken({
    token,
  });

  return newBlacktoken.save();
}
exports.invalidateToken = invalidateToken;

function isTokenValid(token) {
  return Blacktoken.findOne({ token }).then(
    (blacktoken) => {
      if (!blacktoken) {
        return Promise.resolve();
      }
      return Promise.reject({ success: false, message: 'Token blacklisted.' });
    },
    err => err,
  );
}
exports.isTokenValid = isTokenValid;
