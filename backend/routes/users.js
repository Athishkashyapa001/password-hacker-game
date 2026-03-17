const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getMatches,
  searchUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All user routes are protected
router.use(protect);

// Basic profile routes (Explicitly split to ensure Express 4/5 compatibility)
router.get('/profile', getProfile);
router.get('/profile/:userId', getProfile);

// Update profile with picture upload
router.put('/profile', upload.single('profilePicture'), updateProfile);

// Matching and search
router.get('/matches', getMatches);
router.get('/search', searchUsers);

module.exports = router;
