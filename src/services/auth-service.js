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
      // return user unknown promise
    } else if (user.password !== password) {
      // return wrong password promise
    } else {
      // return success promise
    }
  });
}
exports.authenticateUser = authenticateUser;
