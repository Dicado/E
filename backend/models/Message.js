const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  senderType: {
    type: DataTypes.ENUM('user', 'manager', 'system'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('text', 'file'),
    defaultValue: 'text'
  }
}, {
  tableName: 'Messages',
  timestamps: true
});

Message.getMessagesByChatId = async function (chatId) {
  return await Message.findAll({
    where: { chatId },
    order: [['createdAt', 'ASC']]
  });
};

Message.createMessage = async function (chatId, senderType, content, type = 'text') {
  return await Message.create({ chatId, senderType, content, type });
};

module.exports = Message;