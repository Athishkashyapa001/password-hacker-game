const Rating = require('../models/Rating');
const User = require('../models/User');

// @desc    Submit a rating & review
// @route   POST /api/ratings
// @access  Private
const submitRating = async (req, res, next) => {
  try {
    const { toUserId, rating, review, requestId } = req.body;

    if (!toUserId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide toUserId and rating',
      });
    }

    if (toUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rate yourself',
      });
    }

    // Check if the user exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: 'User to rate not found',
      });
    }

    // Optionally you could check if the exchange actually happened here,
    // e.g. checking if they share an accepted SkillRequest

    // Create rating
    const newRating = await Rating.create({
      fromUser: req.user._id,
      toUser: toUserId,
      rating,
      review,
      requestId, // optional, links to a specific exchange
    });

    // Update user's aggregate rating
    toUser.rating.total += Number(rating);
    toUser.rating.count += 1;
    await toUser.save();

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this exchange session',
      });
    }
    next(error);
  }
};

// @desc    Get all ratings for a user
// @route   GET /api/ratings/:userId
// @access  Private
const getUserRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ toUser: req.params.userId })
      .populate('fromUser', 'name profilePicture')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitRating,
  getUserRatings,
};
