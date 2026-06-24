const express = require('express');
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validateAuth');

const router = express.Router();

// User Registration Route
router.post('/register', validateRegister, authController.registerController);

// User Login Route
router.post('/login', validateLogin, authController.loginController);

module.exports = router;
