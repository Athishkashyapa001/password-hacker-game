const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getMyRequests,
  acceptRequest,
  rejectRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/send', sendRequest);
router.get('/', getMyRequests);
router.post('/:requestId/accept', acceptRequest);
router.post('/:requestId/reject', rejectRequest);

module.exports = router;
