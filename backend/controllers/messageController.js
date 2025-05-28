const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, sender, content, type = 'text' } = req.body;

    const newMessage = await Message.create({
      chatId,
      senderType: sender,
      content,
      type
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Ошибка отправки сообщения:', err);
    res.status(400).json({ message: err.message });
  }
};
