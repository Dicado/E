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
          order: [['createdAt', 'ASC']],
        });

        socket.emit('chatHistory', messages);
      } catch (err) {
        console.error('[joinChat Error]', err);
        socket.emit('error', 'Не удалось подключиться к чату');
      }
    });

    socket.on('sendMessage', async ({ chatId, message, role }) => {
      try {
        const msg = await Message.create({
          chatId,
          senderType: role,
          content: message,
          type: 'text',
        });

        io.to(chatId).emit('newMessage', msg);
      } catch (err) {
        console.error('[sendMessage Error]', err);
        socket.emit('error', 'Не удалось отправить сообщение');
      }
    });

    socket.on('uploadFile', async ({ chatId, fileUrl, role }) => {
      try {
        if (!fileUrl || !chatId || !role) {
          socket.emit('error', 'Некорректные данные для загрузки файла');
          return;
        }

        const msg = await Message.create({
          chatId,
          senderType: role,
          content: fileUrl,
          type: 'file',
        });

        io.to(chatId).emit('newMessage', msg);
      } catch (err) {
        console.error('[uploadFile Error]', err);
        socket.emit('error', 'Не удалось загрузить файл');
      }
    });

    socket.on('disconnect', () => {
      console.log('🛑 WebSocket отключен:', socket.id);
    });
  });
};
