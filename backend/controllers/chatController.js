const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.getChatById = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    if (!chatId) {
      return res.status(400).json({ error: 'chatId обязателен' });
    }

    const chat = await Chat.findOne({ where: { id: chatId } });
    if (!chat) return res.status(404).json({ error: 'Чат не найден' });

    const messages = await Message.findAll({
      where: { chatId },
      order: [['createdAt', 'ASC']],
    });

    return res.json({
      id: chat.id,
      participants: {
        user: chat.email,
        manager: chat.manager_email || null,
      },
      messages,
    });
  } catch (err) {
    console.error('Ошибка загрузки чата:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};