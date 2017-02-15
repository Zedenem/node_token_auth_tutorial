// Handle routes prefixed by "/api/auth"
const authController = require('../controllers/auth-controller');

const router = require('express').Router();

router.post('/signin', authController.signin);
router.get('/signout', authController.isAuthenticated, authController.signout);
router.post('/signup', authController.signup);

module.exports = router;
