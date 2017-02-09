// Handle routes prefixed by "/api"
const authController = require('../controllers/auth-controller');
const apiController = require('../controllers/api-controller');

const router = require('express').Router();

router.get('/', authController.isAuthenticated, apiController.getWelcome);
router.get('/users', authController.isAuthenticated, apiController.listUsers);

module.exports = router;
