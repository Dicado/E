const Message = require('../models/Message');
const Chat = require('../models/Chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('📡 WebSocket подключен:', socket.id);

    socket.on('joinChat', async ({ chatId, email, role }) => {
      try {
        socket.join(chatId);

        const chat = await Chat.findByPk(chatId);
        if (role === 'manager' && !chat.manager_email) {
          await Chat.update({ manager_email: email }, { where: { id: chatId } });
        }

        const messages = await Message.findAll({
          where: { chatId },
          order: [['createdAt', 'ASC']]
        });

        socket.emit('chatHistory', messages);
      } catch (err) {
        console.error('Ошибка joinChat:', err);
        socket.emit('error', 'Не удалось подключиться к чату');
      }
    });

    socket.on('sendMessage', async ({ chatId, message, role }) => {
      try {
        const msg = await Message.create({
          chatId,
          senderType: role,
          content: message,
          type: 'text'
        });

        io.to(chatId).emit('newMessage', msg);
      } catch (err) {
        console.error('Ошибка sendMessage:', err);
        socket.emit('error', 'Не удалось отправить сообщение');
        console.log('[SOCKET] Получено сообщение:', data);
      }
    });

    socket.on('uploadFile', async ({ chatId, fileUrl, role }) => {
      try {
        const msg = await Message.create({
          chatId,
          senderType: role,
          content: fileUrl,
          type: 'file'
        });

        io.to(chatId).emit('newMessage', msg);
      } catch (err) {
        console.error('Ошибка uploadFile:', err);
        socket.emit('error', 'Не удалось загрузить файл');
      }
    });

    socket.on('disconnect', () => {
      console.log('🛑 WebSocket отключен:', socket.id);
    });
  });
};
