const User = require('../models/user');

function verifyUser(username) {
  return User.findOne({ name: username });
}
exports.verifyUser = verifyUser;

function authenticateUser(username, password) {
  return verifyUser(username)
  .catch(err => err)
  .then((user) => {
    if (!user) {
      return Promise.reject({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user.password !== password) {
      return Promise.reject({ success: false, message: 'Authentication failed. Wrong password.' });
    }
    return Promise.resolve(user);
  });
}
exports.authenticateUser = authenticateUser;
