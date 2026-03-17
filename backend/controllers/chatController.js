const Chat = require('../models/Chat');
const User = require('../models/User');

// @desc    Get chat by ID
// @route   GET /api/chat/:chatId
// @access  Private
const getChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name profilePicture')
      .populate('messages.senderId', 'name profilePicture');

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      (p) => p._id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this chat' });
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chats for user
// @route   GET /api/chat
// @access  Private
const getMyChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name profilePicture')
      .sort('-updatedAt');

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message in a chat (REST API fallback)
// @route   POST /api/chat/:chatId/message
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const newMessage = {
      senderId: req.user._id,
      text,
      timestamp: Date.now(),
    };

    chat.messages.push(newMessage);
    chat.lastMessage = { text, timestamp: newMessage.timestamp };
    await chat.save();

    // In a real scenario, you'd also emit via socket.io here if connected
    if (req.app.get('io')) {
      req.app.get('io').to(chat._id.toString()).emit('receive_message', newMessage);
    }

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChat,
  getMyChats,
  sendMessage,
};
