const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');

const CHATS_DIR = path.join(__dirname, 'chats');
const MANAGERS_FILE = path.join(__dirname, 'managers.json');

const initStorage = async () => {
  await fs.ensureDir(CHATS_DIR);
  if (!await fs.pathExists(MANAGERS_FILE)) {
    await fs.writeJson(MANAGERS_FILE, []);
  }
};

const ChatManager = {
  async createChat(email, message) {
    const chatId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const createdAt = moment().tz('Asia/Irkutsk').format();
    
    const chatData = {
      chatId,
      participants: {
        user: email,
        manager: null
      },
      messages: [{
        type: 'system',
        content: 'Чат создан',
        sender: 'system',
        timestamp: createdAt
      }],
      createdAt,
      originalMessage: message
    };

    await fs.writeJson(path.join(CHATS_DIR, `${chatId}.json`), chatData);
    return chatData;
  },

  async getChat(chatId) {
    return fs.readJson(path.join(CHATS_DIR, `${chatId}.json`));
  },

  async updateChat(chat) {
    await fs.writeJson(path.join(CHATS_DIR, `${chat.chatId}.json`), chat);
    return chat;
  },

  async addMessage(chatId, content, senderType, isFile = false) {
    const chat = await this.getChat(chatId);
    const newMessage = {
      type: isFile ? 'file' : 'message',
      content,
      sender: senderType,
      timestamp: moment().tz('Asia/Irkutsk').format()
    };
    chat.messages.push(newMessage);
    await this.updateChat(chat);
    return chat;
  },

  async getAllChats() {
    const files = await fs.readdir(CHATS_DIR);
    return Promise.all(files.map(file => fs.readJson(path.join(CHATS_DIR, file))));
  }
};

module.exports = { initStorage, ChatManager };