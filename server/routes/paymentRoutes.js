const express = require('express');
const router = express.Router();

// @route   GET /api/payments/test
// @desc    Test Payments API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payments API working',
  });
});

module.exports = router;
