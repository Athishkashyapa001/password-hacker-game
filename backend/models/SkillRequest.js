const mongoose = require('mongoose');

const skillRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillOffered: {
      type: String,
      required: [true, 'Skill offered is required'],
      trim: true,
    },
    skillRequested: {
      type: String,
      required: [true, 'Skill requested is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      default: '',
      maxlength: [300, 'Message cannot exceed 300 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SkillRequest', skillRequestSchema);
