const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_pro_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Registers a new user.
 * @param {Object} userData - Fields for registration (username, email, password).
 * @returns {Promise<Object>} The registered user details without password.
 */
async function registerUser({ username, email, password }) {
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });

  // Return user without password
  const userJson = user.toJSON();
  delete userJson.password;
  return userJson;
}

/**
 * Log in a user.
 * @param {Object} credentials - Login credentials (email, password).
 * @returns {Promise<Object>} The user profile and JWT token.
 */
async function loginUser({ email, password }) {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const userJson = user.toJSON();
  delete userJson.password;

  return {
    user: userJson,
    token
  };
}

module.exports = {
  registerUser,
  loginUser
};
