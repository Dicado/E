const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, sender, content, type = 'text' } = req.body;

    if (!chatId || !sender || !content) {
      return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
    }

    const message = await Message.create({
      chatId,
      senderType: sender,
      content,
      type,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('Ошибка при отправке сообщения:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
