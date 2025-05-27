const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');

router.get('/:chatId', ChatController.getChatById);

module.exports = router;