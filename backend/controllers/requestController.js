const SkillRequest = require('../models/SkillRequest');
const Chat = require('../models/Chat');
const User = require('../models/User');

// @desc    Send a skill exchange request
// @route   POST /api/requests/send
// @access  Private
const sendRequest = async (req, res, next) => {
  try {
    const { receiverId, skillOffered, skillRequested, message } = req.body;

    if (!receiverId || !skillOffered || !skillRequested) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiverId, skillOffered, and skillRequested',
      });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a request to yourself',
      });
    }

    // Protect against duplicate pending requests
    const existingRequest = await SkillRequest.findOne({
      senderId: req.user._id,
      receiverId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request with this user',
      });
    }

    const request = await SkillRequest.create({
      senderId: req.user._id,
      receiverId,
      skillOffered,
      skillRequested,
      message,
    });

    res.status(201).json({
      success: true,
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all incoming & outgoing requests for current user
// @route   GET /api/requests
// @access  Private
const getMyRequests = async (req, res, next) => {
  try {
    const incoming = await SkillRequest.find({ receiverId: req.user._id })
      .populate('senderId', 'name profilePicture avgRating location')
      .sort('-createdAt');

    const outgoing = await SkillRequest.find({ senderId: req.user._id })
      .populate('receiverId', 'name profilePicture avgRating location')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      incoming,
      outgoing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a request and create a chat room
// @route   POST /api/requests/:id/accept
// @access  Private
const acceptRequest = async (req, res, next) => {
  try {
    const request = await SkillRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Verify current user is the receiver
    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
    }

    request.status = 'accepted';
    await request.save();

    // Create a new Chat Room for these two users
    let chat = await Chat.findOne({
      participants: { $all: [request.senderId, request.receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [request.senderId, request.receiverId],
        requestId: request._id,
        messages: [{
          senderId: req.user._id,
          text: `Skill exchange accepted! Let's chat about swapping ${request.skillRequested} for ${request.skillOffered}.`,
        }]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Request accepted, chat room created.',
      request,
      chatId: chat._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a request
// @route   POST /api/requests/:id/reject
// @access  Private
const rejectRequest = async (req, res, next) => {
  try {
    const request = await SkillRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Verify current user is the receiver
    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request rejected',
      request,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendRequest,
  getMyRequests,
  acceptRequest,
  rejectRequest,
};
