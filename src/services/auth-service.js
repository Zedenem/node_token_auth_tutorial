const bcrypt = require('bcrypt');
const validator = require('validator');

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
    err => err,
  );
}
exports.authenticateUser = authenticateUser;

function createUser(username, password, admin) {
  if (!validator.isEmail(username)) {
    return Promise.reject({ success: false, message: 'Username is not a valid email address.' });
  } else if (!validator.isLength(password, { min: 8, max: undefined })) {
    return Promise.reject({ success: false, message: 'Password is too short.' });
  } else if (validator.isAlpha(password)) {
    return Promise.reject({ success: false, message: 'Password should contain at least one non-alpha character.' });
  }
  return verifyUser(username).then(
    (user) => {
      if (user) {
        return Promise.reject({ success: false, message: 'Username is not available.' });
      }
      return bcrypt.hash(password, saltRounds).then(
        (hashedPassword) => {
          const newUser = new User({
            username,
            password: hashedPassword,
            admin,
          });

          // Save the sample user
          return newUser.save();
        },
      );
    },
    err => err,
  );
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
