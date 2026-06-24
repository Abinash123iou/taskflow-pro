require('dotenv').config();
const app = require('./app');
const { sequelize, authenticateDatabase } = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Initializes database connection, syncs Sequelize models, and starts the Express server.
 */
async function startServer() {
  try {
    console.log('Initializing TaskFlow Pro Backend server...');

    // 1. Connect and Authenticate Database
    const dbConnected = await authenticateDatabase();
    if (!dbConnected) {
      throw new Error('Database connection authentication failed.');
    }

    // 2. Sync Models (Ensures Sequelize has registered all defined schemas, altering tables to match updates)
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');

    // 3. Start Listening for HTTP Requests
    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Fatal error during application startup:', error.message);
    process.exit(1);
  }
}

// Start the server process
startServer();
