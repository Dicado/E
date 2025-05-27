const ChatManager = require('../managers/ChatManager');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('WebSocket подключен:', socket.id);

    socket.on('joinChat', async ({ chatId, email, role }) => {
      try {
        socket.join(chatId);

        const chat = await ChatManager.getChat(chatId);
        if (!chat) {
          return socket.emit('error', 'Чат не найден');
        }

        if (role === 'manager' && !chat.manager_email) {
          await ChatManager.updateChatManager(chatId, email);
        }

        const messages = chat.Messages || [];
        socket.emit('chatHistory', messages);
      } catch (err) {
        console.error('Ошибка при подключении к чату:', err);
        socket.emit('error', 'Ошибка сервера');
      }
    });

    socket.on('sendMessage', async ({ chatId, message, role }) => {
      try {
        const newMessage = await ChatManager.addMessage(chatId, message, role);
        io.to(chatId).emit('newMessage', newMessage);
      } catch (err) {
        console.error('Ошибка при отправке сообщения:', err);
        socket.emit('error', 'Ошибка сервера');
      }
    });

    socket.on('disconnect', () => {
      console.log('WebSocket отключен:', socket.id);
    });
  });
};