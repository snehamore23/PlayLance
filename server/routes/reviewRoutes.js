const express = require('express');
const router = express.Router();

// @route   GET /api/reviews/test
// @desc    Test Reviews API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Reviews API working',
  });
});

module.exports = router;
