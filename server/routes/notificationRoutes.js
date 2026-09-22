const express = require('express');
const router = express.Router();

// @route   GET /api/notifications/test
// @desc    Test Notifications API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notifications API working',
  });
});

module.exports = router;
