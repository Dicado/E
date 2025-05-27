const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  role: {
    type: DataTypes.ENUM('user', 'manager'),
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: true // может быть null если OAuth
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;