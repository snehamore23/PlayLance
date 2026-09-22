const express = require('express');
const router = express.Router();

// @route   GET /api/users/test
// @desc    Test Users API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Users API working',
  });
});

module.exports = router;
