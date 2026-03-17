const User = require('../models/User');

// @desc    Get user profile (self or other)
// @route   GET /api/users/profile/:id?
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user._id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & skills
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, location, skillsOffered, skillsWanted } = req.body;

    // Optional profile picture upload via multer
    let profilePictureMatch = req.user.profilePicture;
    if (req.file) {
      profilePictureMatch = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        bio: bio !== undefined ? bio : req.user.bio,
        location: location !== undefined ? location : req.user.location,
        skillsOffered: skillsOffered ? JSON.parse(skillsOffered) : req.user.skillsOffered,
        skillsWanted: skillsWanted ? JSON.parse(skillsWanted) : req.user.skillsWanted,
        profilePicture: profilePictureMatch,
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill matches for current user
// @route   GET /api/users/matches
// @access  Private
const getMatches = async (req, res, next) => {
  try {
    const currentUser = req.user;

    // If user hasn't set up skills yet, return empty
    if (!currentUser.skillsWanted.length || !currentUser.skillsOffered.length) {
      return res.status(200).json({ success: true, matches: [] });
    }

    // Find all other users
    const otherUsers = await User.find({
      _id: { $ne: currentUser._id },
    }).select('-password');

    const matchedUsers = [];

    otherUsers.forEach((otherUser) => {
      // Intersection: What I want ∩ What they offer
      const matchA = currentUser.skillsWanted.filter((skill) =>
        otherUser.skillsOffered.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );

      // Intersection: What they want ∩ What I offer
      const matchB = otherUser.skillsWanted.filter((skill) =>
        currentUser.skillsOffered.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );

      // We only consider it a match if BOTH parties get something they want
      if (matchA.length > 0 && matchB.length > 0) {
        // Calculate Match Score
        // Base score for mutual skills
        let score = (matchA.length + matchB.length) * 5;

        // Location bonus
        if (
          currentUser.location &&
          otherUser.location &&
          currentUser.location.toLowerCase() === otherUser.location.toLowerCase()
        ) {
          score += 2;
        }

        // Rating bonus
        score += otherUser.avgRating;

        matchedUsers.push({
          user: otherUser,
          matchScore: score,
          matchedSkillsForMe: matchA,
          matchedSkillsForThem: matchB,
        });
      }
    });

    // Sort by highest score descending
    matchedUsers.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: matchedUsers.length,
      matches: matchedUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users by name or skill
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    let filter = { _id: { $ne: req.user._id } };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { skillsOffered: { $regex: query, $options: 'i' } },
        { skillsWanted: { $regex: query, $options: 'i' } }
      ];
    }

    const users = await User.find(filter).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getMatches,
  searchUsers,
};
