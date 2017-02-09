const User = require('../models/user');

function listUsers() {
  return User.find();
}
exports.listUsers = listUsers;
