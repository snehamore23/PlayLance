const express = require('express');
const router = express.Router();

// @route   GET /api/messages/test
// @desc    Test Messages API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Messages API working',
  });
});

module.exports = router;
