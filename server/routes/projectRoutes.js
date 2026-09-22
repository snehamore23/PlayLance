const express = require('express');
const router = express.Router();

// @route   GET /api/projects/test
// @desc    Test Projects API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Projects API working',
  });
});

module.exports = router;
