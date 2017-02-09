const userService = require('../services/user-service');

function getWelcome(req, res) {
  res.json({ message: 'Welcome to the coolest API on Earth!' });
}
exports.getWelcome = getWelcome;

function listUsers(req, res) {
  userService.listUsers().then(
    users => res.json(users),
    err => res.status(400).send(err),
  );
}
exports.listUsers = listUsers;
