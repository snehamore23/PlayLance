const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  getMyPayments,
  getPaymentById,
  stripeWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// @route   POST /api/payments/webhook
// @desc    Stripe webhook endpoint
// @access  Public (Stripe calls this)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// @route   POST /api/payments/create-checkout-session
// @desc    Create a Stripe Checkout Session
// @access  Private (client only)
router.post('/create-checkout-session', protect, allowRoles('client'), createCheckoutSession);

// @route   POST /api/payments/create (alias for compatibility)
// @desc    Create a Stripe Checkout Session
// @access  Private (client only)
router.post('/create', protect, allowRoles('client'), createCheckoutSession);

// @route   GET /api/payments/my
// @desc    Get payments for the logged-in user
// @access  Private
router.get('/my', protect, getMyPayments);

// @route   GET /api/payments/test
// @desc    Test Payments API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payments API working',
  });
});

// @route   GET /api/payments/:id
// @desc    Get single payment by ID
// @access  Private (related client or freelancer)
router.get('/:id', protect, getPaymentById);

module.exports = router;
