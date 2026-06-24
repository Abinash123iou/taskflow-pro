const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    validate: {
      notNull: { msg: 'User ID is required' }
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: { msg: 'Title is required' },
      notEmpty: { msg: 'Title cannot be empty' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Description is required' },
      len: {
        args: [20, 65535],
        msg: 'Description must contain at least 20 characters'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
    allowNull: false,
    defaultValue: 'Pending',
    validate: {
      isIn: {
        args: [['Pending', 'In Progress', 'Completed']],
        msg: 'Status must be Pending, In Progress, or Completed'
      }
    }
  }
}, {
  tableName: 'tasks',
  timestamps: true,
  underscored: true // Maps camelCase fields like createdAt/updatedAt to created_at/updated_at
});

// Define model relationships
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Task;
