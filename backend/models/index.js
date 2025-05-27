const sequelize = require('../config/db');
const Sequelize = require('sequelize');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Подключение моделей
db.Chat = require('./Chat');
db.Message = require('./Message');

// Ассоциации
db.Chat.hasMany(db.Message, { foreignKey: 'chatId', onDelete: 'CASCADE' });
db.Message.belongsTo(db.Chat, { foreignKey: 'chatId' });

module.exports = db;