const express = require('express');
const router = express.Router();

// @route   GET /api/applications/test
// @desc    Test Applications API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Applications API working',
  });
});

module.exports = router;
