require('dotenv').config();
const app = require('./app');
const { sequelize, authenticateDatabase } = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 5000;

async function seedDatabase() {
  try {
    const demoEmail = 'demo@taskflow.pro';
    let user = await User.findOne({ where: { email: demoEmail } });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('welcome2024', salt);
      user = await User.create({
        username: 'Alexander',
        email: demoEmail,
        password: hashedPassword
      });
      console.log('Seeded demo user successfully.');
    }

    const taskCount = await Task.count({ where: { userId: user.id } });
    if (taskCount === 0) {
      await Task.bulkCreate([
        {
          userId: user.id,
          title: 'Refactor Authentication Logic',
          description: 'Update JWT validation flow to support refresh tokens and enhance cookie-based security configurations.',
          status: 'In Progress',
          priority: 'High',
          dueDate: '2026-10-24'
        },
        {
          userId: user.id,
          title: 'Cloud Infrastructure Audit',
          description: 'Review AWS billing and optimize underutilized EC2 instances to reduce the overall infrastructure budget.',
          status: 'Pending',
          priority: 'Medium',
          dueDate: '2026-10-22'
        },
        {
          userId: user.id,
          title: 'Design System Documentation',
          description: 'Finalize documentation for the new typography and grid system inside our component library repository.',
          status: 'Completed',
          priority: 'Low',
          dueDate: '2026-10-20'
        },
        {
          userId: user.id,
          title: 'Onboarding Flow UX Testing',
          description: 'Conduct 5 user tests with the alpha cohort for the 2.0 flow to find onboarding friction points.',
          status: 'In Progress',
          priority: 'High',
          dueDate: '2026-10-19'
        },
        {
          userId: user.id,
          title: 'Q4 Strategic Planning',
          description: 'Coordinate with team leads for capacity planning and objective setting for the upcoming Q4 goals.',
          status: 'Pending',
          priority: 'High',
          dueDate: '2026-10-18'
        }
      ]);
      console.log('Seeded initial tasks successfully.');
    }
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}

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

    // Seed database
    await seedDatabase();

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

