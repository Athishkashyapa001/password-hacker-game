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

// Basic profile routes (Split to avoid optional parameter syntax issues in production)
router.get('/profile', getProfile);
router.get('/profile/:id', getProfile);

// Update profile with picture upload
router.put('/profile', upload.single('profilePicture'), updateProfile);

// Matching and search
router.get('/matches', getMatches);
router.get('/search', searchUsers);

module.exports = router;
