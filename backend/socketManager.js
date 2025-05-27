const Chat = require('./models/Chat');
const Message = require('./models/Message');

function setupSocket(io) {
    io.on('connection', (socket) => {
        console.log('Новое подключение:', socket.id);

        socket.on('joinChat', async ({ chatId, role, email }) => {
            try {
                const chat = await Chat.getChatById(chatId);
                if (!chat) return socket.emit('error', 'Чат не найден');

                if (role === 'manager' && !chat.man3010ager_email) {
                    await Chat.updateChatManager(chatId, email);
                }

                const messages = await Message.getMessagesByChatId(chatId);
                socket.join(chatId);
                socket.emit('chatHistory', messages);
            } catch (err) {
                console.error(err);
                socket.emit('error', 'Ошибка при подключении к чату');
            }
        });

        socket.on('sendMessage', async ({ chatId, message, role }) => {
            try {
                const msg = await Message.createMessage(chatId, role, message);
                io.to(chatId).emit('newMessage', {
                    chatId,
                    sender: role,
                    content: message,
                    timestamp: new Date(),
                    type: 'text'
                });
            } catch (err) {
                console.error(err);
                socket.emit('error', 'Ошибка отправки сообщения');
            }
        });

        socket.on('uploadFile', async ({ chatId, fileUrl, role }) => {
            try {
                const msg = await Message.createMessage(chatId, role, fileUrl, 'file');
                io.to(chatId).emit('newMessage', {
                    chatId,
                    sender: role,
                    content: fileUrl,
                    timestamp: new Date(),
                    type: 'file'
                });
            } catch (err) {
                console.error(err);
                socket.emit('error', 'Ошибка при загрузке файла');
            }
        });

        socket.on('disconnect', () => {
            console.log('Отключение сокета:', socket.id);
        });
    });
}

module.exports = { setupSocket };
