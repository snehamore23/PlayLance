const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { getProjectApplications } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (client only)
router.post('/', protect, allowRoles('client'), createProject);

// @route   GET /api/projects
// @desc    Get all projects (with optional filters)
// @access  Public
router.get('/', getProjects);

// @route   GET /api/projects/test
// @desc    Test Projects API route
// @access  Public
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Projects API working',
  });
});

// @route   GET /api/projects/:projectId/applications
// @desc    Get all applications for a project
// @access  Private (client — project owner only)
router.get('/:projectId/applications', protect, allowRoles('client'), getProjectApplications);

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Public
router.get('/:id', getProjectById);

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private (client — owner only)
router.put('/:id', protect, allowRoles('client'), updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private (client — owner only)
router.delete('/:id', protect, allowRoles('client'), deleteProject);

module.exports = router;
