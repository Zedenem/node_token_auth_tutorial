// Handle routes prefixed by "/auth"
const authController = require('../controllers/auth-controller');

const router = require('express').Router();

router.post('/signin', authController.signin);
router.get('/signout', authController.signout);

module.exports = router;
