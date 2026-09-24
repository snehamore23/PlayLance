const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  updateApplicationStatus,
  getApplicationById,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// @route   POST /api/applications
// @desc    Apply to a project
// @access  Private (freelancer only)
router.post('/', protect, allowRoles('freelancer'), createApplication);

// @route   GET /api/applications/my
// @desc    Get logged-in freelancer's applications
// @access  Private (freelancer only)
router.get('/my', protect, allowRoles('freelancer'), getMyApplications);

// @route   GET /api/applications/test
// @desc    Test Applications API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Applications API working',
  });
});

// @route   PUT /api/applications/:id/status
// @desc    Accept or reject an application
// @access  Private (client — project owner only)
router.put('/:id/status', protect, allowRoles('client'), updateApplicationStatus);

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private (related freelancer or project owner)
router.get('/:id', protect, getApplicationById);

module.exports = router;
