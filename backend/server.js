const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const { sendInvitationEmail } = require('./mailer');
const { setupSocket } = require('./socketManager');
const { initStorage, ChatManager } = require('./chatStorage');
const moment = require('moment-timezone');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const upload = multer({ dest: 'backend/uploads/', limits: { fileSize: 20 * 1024 * 1024 } });

initStorage();

const {
  LOGIN,
  PASSWORD,
  COMPANY_NAME,
  COLUMN_ID,
  API_URL,
  AUTH_COMPANIES_URL,
  API_KEY,
  PORT = 5000,
  FRONTEND_URL = 'http://localhost:3000',
} = process.env;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/chat-key', (req, res) => {
  res.json({ key: process.env.SECRET_KEY });
});

// Кэш
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

async function getApiKey() {
  return API_KEY;
}

// Создание чата
app.post('/api/feedback', async (req, res) => {
  try {
    const { email, message } = req.body;
    const chatData = await ChatManager.createChat(email, message);

    const irkutskTime = moment(chatData.createdAt).tz('Asia/Irkutsk').format('DD.MM.YYYY HH:mm:ss');
    const shortText = message.length > 80 ? message.slice(0, 80) + '...' : message;
    const fullText = message.replace(/\n/g, '<br>');
    const chatLink = `${FRONTEND_URL}/chat/${chatData.chatId}?role=manager`;

    const taskData = {
      title: `Обращение от ${email}\n${irkutskTime}\n${shortText}`,
      description: `
              <p><strong>Пользователь:</strong> ${email}</p>
              <p><strong>Дата и время:</strong> ${irkutskTime}</p>
              <p><strong>Сообщение:</strong></p>
              <p>${fullText}</p>
              <p><strong>Чтобы открыть чат, нажмите на кнопку:</strong></p>
              <p>
                <a href="${chatLink}" style="display:inline-block;padding:10px 18px;background-color:#007BFF;color:white;text-decoration:none;border-radius:5px;">
                  Открыть чат
                </a>
              </p>
            `,
      columnId: COLUMN_ID,
      archived: false,
      completed: false
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

app.get('/api/chats', async (req, res) => {
  try {
    const chats = await ChatManager.getAllChats();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения чатов' });
  }
});

app.post('/api/chat/:chatId/message', async (req, res) => {
  try {
    const chat = await ChatManager.addMessage(
      req.params.chatId,
      req.body.message,
      req.body.senderType
    );
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Загрузка файлов
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не был загружен' });
  }
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

app.get('/api/chats/:chatId', async (req, res) => {
  try {
    const chat = await ChatManager.getChat(req.params.chatId);
    res.json(chat);
  } catch (err) {
    res.status(404).json({ error: 'Чат не найден' });
  }
});

// Подключаем сокеты
setupSocket(io);

server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

