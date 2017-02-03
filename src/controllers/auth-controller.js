const jsonWebToken = require('jsonwebtoken');

const config = require('../config');
const authService = require('../services/auth-service');

function signin(req, res) {
  authService.authenticateUser(req.body.username, req.body.password).then(
  (user) => {
    res.json({
      success: true,
      message: 'Authentication succeeded. Token provided.',
      token: jsonWebToken.sign(user, config.secret, { expiresIn: '1d' }),
    });
  },
  err => res.status(401).send(err),
  );
}
exports.signin = signin;

function signout(req, res) {
  // TODO: Invalidate the token
  req.logout();
  req.session.destroy();
  res.redirect('/');
}
exports.signout = signout;

function signup(req, res) {
  authService.createUser(req.body.username, req.body.password, req.body.admin).then(
    () => res.json({ success: true }),
    err => res.status(401).send(err),
  );
}
exports.signup = signup;
