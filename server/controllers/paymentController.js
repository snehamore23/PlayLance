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
    const { projectId } = req.body;

    // 1. Validate projectId
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

    // 2. Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // 3. Verify the client owns this project
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only pay for your own projects',
      });
    }

    // 4. Find the accepted application for this project
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

    // 5. Prevent duplicate active payments
    const existingPayment = await Payment.findOne({
      project: projectId,
      status: { $in: ['pending', 'paid'] },
    });

    if (existingPayment) {
      return res.status(409).json({
        success: false,
        message: existingPayment.status === 'paid'
          ? 'Payment has already been completed for this project'
          : 'A pending payment already exists for this project',
      });
    }

    // 6. Use the project budget as the payment amount (in cents for Stripe)
    const amount = project.budget;
    const amountInCents = Math.round(amount * 100);

    // 7. Create Stripe Checkout Session
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: project.title,
              description: `Payment for project: ${project.title}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        projectId: projectId,
        clientId: req.user._id.toString(),
        freelancerId: acceptedApplication.freelancer.toString(),
      },
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/cancel`,
    });

    // 8. Create a pending Payment record
    const payment = await Payment.create({
      project: projectId,
      client: req.user._id,
      freelancer: acceptedApplication.freelancer,
      amount,
      status: 'pending',
      transactionId: session.id,
    });

    return res.status(200).json({
      success: true,
      message: 'Checkout session created',
      sessionId: session.id,
      url: session.url,
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
// @desc    Get payments for the logged-in user
// @route   GET /api/payments/my
// @access  Private
// ──────────────────────────────────────────────
const getMyPayments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let filter;
    if (userRole === 'client') {
      filter = { client: userId };
    } else {
      filter = { freelancer: userId };
    }

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

    // 3. Only related client or freelancer can view
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
  let event;

  try {
    if (webhookSecret) {
      // Verify the webhook signature
      const sig = req.headers['stripe-signature'];
      event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // In development without webhook secret, parse the event directly
      event = req.body;
    }
  } catch (err) {
    console.error('⚠️ Stripe webhook signature verification failed:', err.message);
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      // Update the payment status to "paid"
      const payment = await Payment.findOne({ transactionId: session.id });

      if (payment) {
        payment.status = 'paid';
        await payment.save();

        // Optionally update project status to "completed"
        const updatedProject = await Project.findByIdAndUpdate(
          payment.project,
          { $set: { status: 'completed' } },
          { new: true }
        );

        const projectTitle = updatedProject ? updatedProject.title : 'Project';

        // Notify freelancer
        await createNotification({
          recipient: payment.freelancer,
          sender: payment.client,
          type: 'PAYMENT_COMPLETED',
          message: `Payment of ₹${payment.amount} for project "${projectTitle}" has been completed.`,
          relatedProject: payment.project,
        });

        // Notify client
        await createNotification({
          recipient: payment.client,
          sender: null,
          type: 'PAYMENT_COMPLETED',
          message: `Your payment of ₹${payment.amount} for project "${projectTitle}" was successful.`,
          relatedProject: payment.project,
        });

        console.log(`✅ Payment ${payment._id} marked as paid for session ${session.id}`);
      } else {
        console.warn(`⚠️ No payment found for session ${session.id}`);
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;

      const payment = await Payment.findOne({ transactionId: session.id });
      if (payment && payment.status === 'pending') {
        payment.status = 'failed';
        await payment.save();
        console.log(`❌ Payment ${payment._id} marked as failed (session expired)`);
      }
      break;
    }

    default:
      // Unhandled event type — ignore silently
      break;
  }

  // Acknowledge receipt of the event
  return res.status(200).json({ received: true });
};

module.exports = {
  createCheckoutSession,
  getMyPayments,
  getPaymentById,
  stripeWebhook,
};
