const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Chat = sequelize.define('Chat', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  manager_email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isClosed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = Chat;