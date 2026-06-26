const express = require('express');
const router = express.Router();

const {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification
} = require('../controllers/notificationController');

const authMiddleware = require('../middleware/authMiddleware');

// Protect all notification routes with JWT verification
router.use(authMiddleware);

// Fetch notifications
router.get('/', getNotifications);

// Mark all notifications as read
router.put('/read-all', markAllRead);

// Mark a specific notification as read
router.put('/:id/read', markRead);

// Delete a specific notification
router.delete('/:id', deleteNotification);

module.exports = router;
