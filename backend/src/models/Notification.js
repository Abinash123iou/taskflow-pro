const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Notification = sequelize.define('Notification', {
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
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Message is required' },
      notEmpty: { msg: 'Message cannot be empty' }
    }
  },
  type: {
    type: DataTypes.ENUM('Info', 'Warning', 'Success'),
    allowNull: false,
    defaultValue: 'Info',
    validate: {
      isIn: {
        args: [['Info', 'Warning', 'Success']],
        msg: 'Type must be Info, Warning, or Success'
      }
    }
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_read'
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  underscored: true // Maps camelCase fields to snake_case in SQLite/MySQL
});

// Define relationships
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Notification;
