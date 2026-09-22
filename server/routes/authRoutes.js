const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');

// @route   POST /api/auth/signup
// @desc    Register a new user (client or freelancer)
// @access  Public
router.post('/signup', signup);

// @route   GET /api/auth/test
// @desc    Test Auth API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth API working',
  });
});

module.exports = router;
