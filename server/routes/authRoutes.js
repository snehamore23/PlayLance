const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// @route   POST /api/auth/signup
// @desc    Register a new user (client or freelancer)
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/profile
// @desc    Get authenticated user profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   GET /api/auth/client-test
// @desc    Test client role-based access
// @access  Private (client only)
router.get('/client-test', protect, allowRoles('client'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Client access granted',
  });
});

// @route   GET /api/auth/freelancer-test
// @desc    Test freelancer role-based access
// @access  Private (freelancer only)
router.get('/freelancer-test', protect, allowRoles('freelancer'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Freelancer access granted',
  });
});

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
