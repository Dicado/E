const { ChatManager } = require('./chatStorage');

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('Новое подключение:', socket.id);

    socket.on('joinChat', async ({ chatId, role, email }) => {
      try {
        const chat = await ChatManager.getChat(chatId);
        
        if (role === 'manager' && !chat.participants.manager) {
          chat.participants.manager = email;
          await ChatManager.updateChat(chat);
        }

        socket.join(chatId);
        socket.emit('chatHistory', chat.messages);
      } catch (err) {
        socket.emit('error', 'Чат не найден');
      }
    });

    socket.on('sendMessage', async ({ chatId, message, role }) => {
      try {
        const chat = await ChatManager.addMessage(chatId, message, role);
        io.to(chatId).emit('newMessage', chat.messages.slice(-1)[0]);
      } catch (err) {
        socket.emit('error', 'Ошибка отправки сообщения');
      }
    });

    socket.on('uploadFile', async ({ chatId, fileUrl, role }) => {
      try {
        const chat = await ChatManager.addMessage(chatId, fileUrl, role, true);
        io.to(chatId).emit('newMessage', chat.messages.slice(-1)[0]);
      } catch (err) {
        socket.emit('error', 'Ошибка загрузки файла');
      }
    });

    socket.on('disconnect', () => {
      console.log('Отключился:', socket.id);
    });
  });
}

module.exports = { setupSocket };