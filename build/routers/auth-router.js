'use strict';

// Handle routes prefixed by "/auth"
var authController = require('../controllers/auth-controller');

var router = require('express').Router();

router.post('/signin', authController.signin);
router.get('/signout', authController.signout);

module.exports = router;
//# sourceMappingURL=auth-router.js.map