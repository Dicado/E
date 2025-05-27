const Chat = require('../models/Chat');
const Message = require('../models/Message');

const ChatManager = {
  createChat: async (email, message) => {
    const chat = await Chat.create({ email });
    const msg = await Message.create({
      chatId: chat.id,
      senderType: 'user',
      content: message,
    });

    return {
      chatId: chat.id,
      createdAt: chat.createdAt,
      message: msg,
    };
  },

  getAllChats: async () => {
    return await Chat.findAll({ include: [Message] });
  },

  getChat: async (id) => {
    return await Chat.findByPk(id, {
      include: [Message],
    });
  },

  addMessage: async (chatId, content, senderType) => {
    const chat = await Chat.findByPk(chatId);
    if (!chat) return null;

    return await Message.create({
      chatId,
      senderType,
      content,
    });
  },

  updateChatManager: async (chatId, email) => {
    const chat = await Chat.findByPk(chatId);
    if (!chat) return null;

    chat.manager_email = email;
    await chat.save();
    return chat;
  },
};

module.exports = ChatManager;