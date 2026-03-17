const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating value is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    review: {
      type: String,
      default: '',
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillRequest',
    },
  },
  { timestamps: true }
);

// Prevent duplicate ratings for same exchange
ratingSchema.index({ fromUser: 1, toUser: 1, requestId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
