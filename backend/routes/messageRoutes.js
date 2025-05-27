const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/messageController');

// POST /api/messages
router.post('/', sendMessage);

module.exports = router;