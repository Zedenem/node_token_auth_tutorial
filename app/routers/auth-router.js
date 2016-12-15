// Handle routes prefixed by "/auth/"
const jsonWebToken = require('jsonwebtoken');

const config = require('../../config');
const User = require('../models/user');

const router = require('express').Router();

router.post('/signin', (req, res) => {
  User.findOne({ name: req.body.name }).then(
    (user) => {
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user.password !== req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // Security flaw: remove password from object before signing it (JWT doesn't encrypt by default, it base64 encodes only)
        const token = jsonWebToken.sign(user, config.secret, { expiresIn: '1d' });
        res.json({
          success: true,
          message: 'Authentication succeeded. Token provided.',
          token: token
        });
      }
    },
    (err) => { throw err; }
  );
});

module.exports = router;
