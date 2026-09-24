const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByUser,
  getReviewsByProject,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/reviews
// @desc    Create a review for a completed project
// @access  Private
router.post('/', protect, createReview);

// @route   GET /api/reviews/test
// @desc    Test Reviews API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Reviews API working',
  });
});

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews received by a user
// @access  Public
router.get('/user/:userId', getReviewsByUser);

// @route   GET /api/reviews/project/:projectId
// @desc    Get reviews for a project
// @access  Public
router.get('/project/:projectId', getReviewsByProject);

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private (original reviewer only)
router.put('/:id', protect, updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (original reviewer only)
router.delete('/:id', protect, deleteReview);

module.exports = router;
