const express = require('express');
const router = express.Router();
const {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  markMessageAsRead,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/messages/conversations
// @desc    Create a conversation
// @access  Private
router.post('/conversations', protect, createConversation);

// @route   GET /api/messages/conversations
// @desc    Get all conversations for the logged-in user
// @access  Private
router.get('/conversations', protect, getConversations);

// @route   GET /api/messages/test
// @desc    Test Messages API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Messages API working',
  });
});

// @route   GET /api/messages/conversations/:conversationId
// @desc    Get messages in a conversation
// @access  Private (participants only)
router.get('/conversations/:conversationId', protect, getMessages);

// @route   POST /api/messages/conversations/:conversationId
// @desc    Send a message in a conversation
// @access  Private (participants only)
router.post('/conversations/:conversationId', protect, sendMessage);

// @route   PUT /api/messages/:messageId/read
// @desc    Mark a message as read
// @access  Private (receiver/participant only)
router.put('/:messageId/read', protect, markMessageAsRead);

module.exports = router;
