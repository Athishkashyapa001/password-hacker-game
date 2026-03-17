const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: [2000, 'Message too long'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillRequest',
    },
    messages: [messageSchema],
    lastMessage: {
      text: String,
      timestamp: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
