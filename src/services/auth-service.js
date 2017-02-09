const bcrypt = require('bcrypt');

const User = require('../models/user');
const Blacktoken = require('../models/blacktoken');

const saltRounds = 12;

function verifyUser(username) {
  // TODO: Use find instead of findOne for performance purposes
  return User.findOne({ username });
}

function authenticateUser(username, password) {
  return verifyUser(username).then(
  (user) => {
    if (!user) {
      return Promise.reject({ success: false, message: 'Authentication failed. User not found.' });
    }
    return bcrypt.compare(password, user.password).then(
      (res) => {
        if (res !== true) {
          return Promise.reject({ success: false, message: 'Authentication failed. Wrong password.' });
        }
        return Promise.resolve(user);
      },
    );
  },
  err => err);
}
exports.authenticateUser = authenticateUser;

function createUser(username, password, admin) {
  // Create a sample user
  return bcrypt.hash(password, saltRounds).then(
    (hashedPassword) => {
      const newUser = new User({
        username,
        password: hashedPassword,
        admin,
      });

      // Save the sample user
      return newUser.save();
    });
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
      if (blacktoken) {
        return Promise.reject({ success: false, message: 'Token blacklisted.' });
      }
      return Promise.resolve();
    },
    err => err,
  );
}
exports.isTokenValid = isTokenValid;
