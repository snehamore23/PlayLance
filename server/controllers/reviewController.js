const mongoose = require('mongoose');
const Review = require('../models/Review');
const Project = require('../models/Project');
const Application = require('../models/Application');
const User = require('../models/User');
const createNotification = require('../utils/createNotification');

// ──────────────────────────────────────────────
// Helper: Recalculate and save average rating for a user
// ──────────────────────────────────────────────
const recalculateUserRating = async (userId) => {
  const result = await Review.aggregate([
    { $match: { reviewedUser: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } },
  ]);

  const avgRating = result.length > 0
    ? Math.round(result[0].avgRating * 10) / 10
    : 0;

  await User.findByIdAndUpdate(userId, { rating: avgRating });
};

// ──────────────────────────────────────────────
// @desc    Create a review for a completed project
// @route   POST /api/reviews
// @access  Private
// ──────────────────────────────────────────────
const createReview = async (req, res, next) => {
  try {
    const { projectId, reviewedUserId, rating, comment } = req.body;

    // 1. Validate required fields
    if (!projectId || !reviewedUserId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide projectId, reviewedUserId, and rating',
      });
    }

    // 2. Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(reviewedUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reviewed user ID',
      });
    }

    // 3. Validate rating
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5',
      });
    }

    // 4. Cannot review yourself
    if (reviewedUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review yourself',
      });
    }

    // 5. Verify reviewed user exists
    const reviewedUser = await User.findById(reviewedUserId).select('-password');
    if (!reviewedUser) {
      return res.status(404).json({
        success: false,
        message: 'Reviewed user not found',
      });
    }

    // 6. Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // 7. Project must be completed
    if (project.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed projects',
      });
    }

    // 8. Determine the freelancer for this project (from accepted application)
    const acceptedApp = await Application.findOne({
      project: projectId,
      status: 'accepted',
    });

    const clientId = project.client.toString();
    const freelancerId = acceptedApp ? acceptedApp.freelancer.toString() : null;
    const reviewerId = req.user._id.toString();

    // 9. Reviewer must be related to the project (client or freelancer)
    if (reviewerId !== clientId && reviewerId !== freelancerId) {
      return res.status(403).json({
        success: false,
        message: 'You are not related to this project',
      });
    }

    // 10. reviewedUser must be the OTHER party in the project
    if (reviewedUserId !== clientId && reviewedUserId !== freelancerId) {
      return res.status(400).json({
        success: false,
        message: 'The reviewed user is not related to this project',
      });
    }

    if (reviewedUserId === reviewerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review yourself',
      });
    }

    // 11. Check for duplicate review
    const existingReview = await Review.findOne({
      project: projectId,
      reviewer: req.user._id,
      reviewedUser: reviewedUserId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this user for this project',
      });
    }

    // 12. Create the review
    const review = await Review.create({
      project: projectId,
      reviewer: req.user._id,
      reviewedUser: reviewedUserId,
      rating,
      comment: comment || '',
    });

    // 13. Recalculate the reviewed user's average rating
    await recalculateUserRating(reviewedUserId);

    // 14. Send notification to the reviewed user
    await createNotification({
      recipient: reviewedUserId,
      sender: req.user._id,
      type: 'REVIEW_RECEIVED',
      message: `You received a ${rating}-star review for project "${project.title}"`,
      relatedProject: projectId,
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    // Handle duplicate key error (race condition fallback)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this user for this project',
      });
    }

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
// @desc    Get reviews received by a user
// @route   GET /api/reviews/user/:userId
// @access  Public
// ──────────────────────────────────────────────
const getReviewsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const reviews = await Review.find({ reviewedUser: userId })
      .populate('reviewer', 'name profileImage')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Get reviews for a project
// @route   GET /api/reviews/project/:projectId
// @access  Public
// ──────────────────────────────────────────────
const getReviewsByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    const reviews = await Review.find({ project: projectId })
      .populate('reviewer', 'name profileImage')
      .populate('reviewedUser', 'name profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (original reviewer only)
// ──────────────────────────────────────────────
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID',
      });
    }

    // 2. Find the review
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // 3. Only the original reviewer can update
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own reviews',
      });
    }

    // 4. Build updates (only rating and comment allowed)
    const updates = {};

    if (req.body.rating !== undefined) {
      if (typeof req.body.rating !== 'number' || req.body.rating < 1 || req.body.rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be a number between 1 and 5',
        });
      }
      updates.rating = req.body.rating;
    }

    if (req.body.comment !== undefined) {
      if (typeof req.body.comment !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Comment must be a string',
        });
      }
      updates.comment = req.body.comment.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update. You can update rating and comment',
      });
    }

    // 5. Apply updates
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    // 6. Recalculate reviewed user's average rating
    await recalculateUserRating(review.reviewedUser);

    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview,
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
// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (original reviewer only)
// ──────────────────────────────────────────────
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID',
      });
    }

    // 2. Find the review
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // 3. Only the original reviewer can delete
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own reviews',
      });
    }

    const reviewedUserId = review.reviewedUser;

    // 4. Delete the review
    await Review.findByIdAndDelete(id);

    // 5. Recalculate reviewed user's average rating
    await recalculateUserRating(reviewedUserId);

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviewsByUser,
  getReviewsByProject,
  updateReview,
  deleteReview,
};
