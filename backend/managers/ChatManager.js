const moment = require('moment-timezone');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const ChatManager = {
  createChat: async (email) => {
    const chat = await Chat.create({ email });

    // Форматируем время в Иркутске
    const irkTime = moment(chat.createdAt).tz('Asia/Irkutsk').format('DD.MM.YYYY, HH:mm:ss');

    // Приветственное сообщение от системы
    await Message.create({
      chatId: chat.id,
      senderType: 'system',
      content: `Чат создан ${irkTime}`,
    });

    return {
      chatId: chat.id,
      createdAt: chat.createdAt
    };
  },

  getAllChats: async () => {
    return await Chat.findAll();
  },

  getChat: async (id) => {
    return await Chat.findByPk(id);
  },

  getChatById: async (id) => {
    return await Chat.findByPk(id);
  },

  addMessage: async (chatId, content, senderType, type = 'text') => {
    return await Message.create({
      chatId,
      senderType,
      content,
      type
    });
  },

  updateChatManager: async (chatId, email) => {
    const chat = await Chat.findByPk(chatId);
    if (!chat) return null;
    chat.manager_email = email;
    await chat.save();
    return chat;
  }
};

module.exports = ChatManager;