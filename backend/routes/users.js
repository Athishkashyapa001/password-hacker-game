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

router.use(protect);

router.get('/profile', getProfile);
router.get('/profile/:id', getProfile);
router.put('/profile', upload.single('profilePicture'), updateProfile);
router.get('/matches', getMatches);
router.get('/search', searchUsers);

module.exports = router;
