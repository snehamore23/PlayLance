const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/notifications
// @desc    Get all notifications for logged-in user
// @access  Private
router.get('/', protect, getNotifications);

// @route   GET /api/notifications/unread
// @desc    Get unread notifications for logged-in user
// @access  Private
router.get('/unread', protect, getUnreadNotifications);

// @route   GET /api/notifications/test
// @desc    Test Notifications API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notifications API working',
  });
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications for logged-in user as read
// @access  Private
router.put('/read-all', protect, markAllAsRead);

// @route   PUT /api/notifications/:id/read
// @desc    Mark single notification as read
// @access  Private (recipient only)
router.put('/:id/read', protect, markAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private (recipient only)
router.delete('/:id', protect, deleteNotification);

module.exports = router;
