const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, ctrl.getNotifications);
router.post('/', protect, ctrl.createNotification);
router.patch('/:id/read', protect, ctrl.markRead);
router.patch('/mark-all-read', protect, ctrl.markAllRead);

module.exports = router;