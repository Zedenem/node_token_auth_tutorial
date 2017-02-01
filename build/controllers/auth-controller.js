'use strict';

var jsonWebToken = require('jsonwebtoken');

var config = require('../config');
// const User = require('../models/user');
var authService = require('../services/auth-service');

function signin(req, res) {
  authService.verifyUser(req.body.name).catch(function (err) {
    throw err;
  }).then(function (user) {
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user.password !== req.body.password) {
      res.json({ success: false, message: 'Authentication failed. Wrong password.' });
    } else {
      // Security flaw: remove password from object
      // before signing it (JWT doesn't encrypt by default, it base64 encodes only)
      var token = jsonWebToken.sign(user, config.secret, { expiresIn: '1d' });
      res.json({
        success: true,
        message: 'Authentication succeeded. Token provided.',
        token: token
      });
    }
  });
}
exports.signin = signin;

function signout(req, res) {
  // TODO: Invalidate the token
  res.redirect('/');
}
exports.signout = signout;
//# sourceMappingURL=auth-controller.js.map