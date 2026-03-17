const express = require('express');
const router = express.Router();
const { getChat, getMyChats, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getMyChats);
router.get('/:chatId', getChat);
router.post('/:chatId/message', sendMessage);

module.exports = router;
