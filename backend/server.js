require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const moment = require('moment-timezone');
const { Server } = require('socket.io');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// === Импорты пользовательских модулей ===
const db = require('./models'); // <-- подключаем index.js для инициализации моделей
const sequelize = db.sequelize;
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { setupSocket } = require('./socketManager');
const { sendInvitationEmail } = require('./mailer');
const ChatManager = require('./managers/ChatManager');

// === Настройки ===
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const { LOGIN, PASSWORD, COMPANY_NAME, COLUMN_ID, API_URL, AUTH_COMPANIES_URL, API_KEY } = process.env;

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({
  dest: 'backend/uploads/',
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// === Подключение маршрутов ===
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

// === Простой API-ключ для клиента ===
app.get('/api/chat-key', (req, res) => {
  res.json({ key: process.env.SECRET_KEY });
});

// === Кэш ID компании ===
let cachedCompanyId = null;
async function getCompanyId() {
  if (cachedCompanyId) return cachedCompanyId;
  const res = await fetch(AUTH_COMPANIES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: LOGIN, password: PASSWORD, name: COMPANY_NAME }),
  });
  if (!res.ok) throw new Error('Не удалось получить ID компании');
  const data = await res.json();
  cachedCompanyId = data.content?.[0]?.id;
  return cachedCompanyId;
}
const getApiKey = async () => API_KEY;

// === Обработка формы обратной связи ===
app.post('/api/feedback', async (req, res) => {
  try {
    const { email, message } = req.body;
    const chatData = await ChatManager.createChat(email, message);
    const irkTime = moment(chatData.createdAt).tz('Asia/Irkutsk').format('DD.MM.YYYY HH:mm:ss');
    const shortText = message.length > 80 ? message.slice(0, 80) + '...' : message;
    const fullText = message.replace(/\n/g, '<br>');
    const chatLink = `${FRONTEND_URL}/chat/${chatData.chatId}?role=manager`;

    const taskData = {
      title: `Обращение от ${email}\n${irkTime}\n${shortText}`,
      description: `<p><strong>Пользователь:</strong> ${email}</p><p><strong>Дата и время:</strong> ${irkTime}</p><p><strong>Сообщение:</strong></p><p>${fullText}</p><p><a href="${chatLink}" style="padding:10px 18px;background-color:#007BFF;color:white;text-decoration:none;border-radius:5px;">Открыть чат</a></p>`,
      columnId: COLUMN_ID,
      archived: false,
      completed: false,
    };

    const companyId = await getCompanyId();
    const apiKey = await getApiKey();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error(await response.text());

    await sendInvitationEmail(email, `${FRONTEND_URL}/chat/${chatData.chatId}?role=user`);
    res.status(200).json({ chatId: chatData.chatId });

  } catch (err) {
    console.error('[Feedback Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// === Загрузка файлов ===
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не был загружен' });
  }
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

// === WebSocket ===
require('./socket/socketHandlers')(io);
setupSocket(io);

// === Запуск сервера и подключение к базе ===
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to MySQL');
    return sequelize.sync({ alter: true }); // актуализируем схемы
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MySQL connection error:', err);
    process.exit(1);
  });
