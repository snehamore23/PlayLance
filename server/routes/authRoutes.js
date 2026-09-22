const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// @route   POST /api/auth/signup
// @desc    Register a new user (client or freelancer)
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

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
