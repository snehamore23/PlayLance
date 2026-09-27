const mongoose = require('mongoose');
const Stripe = require('stripe');
const Payment = require('../models/Payment');
const Project = require('../models/Project');
const Application = require('../models/Application');
const createNotification = require('../utils/createNotification');

// Lazy-initialize Stripe so env vars are loaded by the time it's used
let _stripe;
const getStripe = () => {
  if (!_stripe) {
    _stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
};

// ──────────────────────────────────────────────
// @desc    Create a Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
// @access  Private (client only)
// ──────────────────────────────────────────────
const createCheckoutSession = async (req, res, next) => {
  try {
    const projectId = req.body.projectId || req.body.project;

    // 1. Validate user role
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only client users can create payments',
      });
    }

    // 2. Validate projectId
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'projectId is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    // 3. Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // 4. Verify the logged-in client owns this project
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only pay for your own projects',
      });
    }

    // 5. Find the accepted application for this project
    const acceptedApplication = await Application.findOne({
      project: projectId,
      status: 'accepted',
    });

    if (!acceptedApplication) {
      return res.status(400).json({
        success: false,
        message: 'No accepted application found for this project. Accept an application first',
      });
    }

    // 6. Use the project's budget as payment amount (in smallest currency unit e.g. cents)
    const amount = project.budget;
    const amountInSmallestUnit = Math.round(amount * 100);

    // 7. Create Stripe Checkout Session (Test mode)
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: project.title,
              description: `Payment for project: ${project.title}`,
            },
            unit_amount: amountInSmallestUnit,
          },
          quantity: 1,
        },
      ],
      metadata: {
        projectId: projectId.toString(),
        clientId: req.user._id.toString(),
        freelancerId: acceptedApplication.freelancer.toString(),
      },
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/my-projects?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payments?cancelled=true`,
    });

    // 8. Create a pending Payment document
    const payment = await Payment.create({
      project: projectId,
      client: req.user._id,
      freelancer: acceptedApplication.freelancer,
      amount,
      status: 'pending',
      transactionId: session.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Checkout session created successfully',
      url: session.url,
      paymentId: payment._id,
      sessionId: session.id,
      payment,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Get payments for the logged-in user (client or freelancer)
// @route   GET /api/payments/my
// @access  Private
// ──────────────────────────────────────────────
const getMyPayments = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Return payments where logged-in user is either client or freelancer
    const filter = {
      $or: [{ client: userId }, { freelancer: userId }],
    };

    const payments = await Payment.find(filter)
      .populate('project', 'title budget status')
      .populate('client', 'name email')
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Get a single payment by ID
// @route   GET /api/payments/:id
// @access  Private (related client or freelancer)
// ──────────────────────────────────────────────
const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID',
      });
    }

    // 2. Find the payment
    const payment = await Payment.findById(id)
      .populate('project', 'title budget status')
      .populate('client', 'name email')
      .populate('freelancer', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // 3. Verify only related client or freelancer can view
    const isClient = payment.client._id.toString() === req.user._id.toString();
    const isFreelancer = payment.freelancer._id.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own payments',
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public (Stripe calls this)
// ──────────────────────────────────────────────
const stripeWebhook = async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook error: STRIPE_WEBHOOK_SECRET is not configured.');
    return res.status(500).json({
      success: false,
      message: 'Webhook error: STRIPE_WEBHOOK_SECRET is missing from server configuration',
    });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    console.error('Stripe webhook error: Missing stripe-signature header.');
    return res.status(400).json({
      success: false,
      message: 'Webhook error: Missing stripe-signature header',
    });
  }

  let event;

  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Find payment using Stripe Checkout Session ID stored in transactionId
    const payment = await Payment.findOne({ transactionId: session.id });

    if (payment) {
      payment.status = 'paid';
      await payment.save();

      // Send notification to freelancer
      await createNotification({
        recipient: payment.freelancer,
        sender: payment.client,
        type: 'PAYMENT_COMPLETED',
        message: `Payment of $${payment.amount} has been completed.`,
        relatedProject: payment.project,
      }).catch(() => {});

      console.log(`Payment ${payment._id} marked as paid for session ${session.id}`);
    } else {
      console.warn(`No payment record found for session ${session.id}`);
    }
  }

  return res.status(200).json({ received: true });
};

module.exports = {
  createCheckoutSession,
  getMyPayments,
  getPaymentById,
  stripeWebhook,
};
