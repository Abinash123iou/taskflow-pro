const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.NODE_ENV === 'test') {
  // Use in-memory SQLite for fast, isolated, independent unit/integration testing
  sequelize = new Sequelize('sqlite::memory:', {
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
} else {
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 3306;

  if (!dbName || !dbUser || !dbPassword) {
    console.warn('Database environment variables are missing. Please check your .env file.');
  }

  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false, // Prevents SQL queries from cluttering console output
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true // Maps camelCase fields to snake_case in MySQL (e.g. created_at, updated_at)
    }
  });
}

/**
 * Verifies database connection.
 * @returns {Promise<boolean>} Resolves to true if connection is successful, false otherwise.
 */
async function authenticateDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    return false;
  }
}

module.exports = {
  sequelize,
  authenticateDatabase
};
