const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'Username is already taken'
    },
    validate: {
      notNull: { msg: 'Username is required' },
      len: {
        args: [3, 50],
        msg: 'Username must be between 3 and 50 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      msg: 'Email address is already registered'
    },
    validate: {
      notNull: { msg: 'Email is required' },
      isEmail: { msg: 'Must be a valid email address' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: { msg: 'Password is required' }
    }
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
  underscored: true
});

module.exports = User;
