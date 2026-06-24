const authService = require('../services/authService');

/**
 * Controller to handle user registration.
 * POST /auth/register
 */
async function registerController(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await authService.registerUser({ username, email, password });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    let statusCode = 500;
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      statusCode = 400;
    } else if (error.status) {
      statusCode = error.status;
    }
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Controller to handle user login.
 * POST /auth/login
 */
async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  registerController,
  loginController
};
