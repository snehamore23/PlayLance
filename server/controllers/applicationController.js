const mongoose = require('mongoose');
const Application = require('../models/Application');
const Project = require('../models/Project');

// ──────────────────────────────────────────────
// @desc    Create a new application (freelancer applies to a project)
// @route   POST /api/applications
// @access  Private (freelancer only)
// ──────────────────────────────────────────────
const createApplication = async (req, res, next) => {
  try {
    const { project, proposal, bidAmount } = req.body;

    // 1. Validate required fields
    if (!project || !proposal || bidAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: project, proposal, and bidAmount',
      });
    }

    // 2. Validate project ObjectId
    if (!mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    // 3. Validate proposal
    if (typeof proposal !== 'string' || !proposal.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Proposal cannot be empty',
      });
    }

    // 4. Validate bidAmount
    if (typeof bidAmount !== 'number' || bidAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Bid amount must be a number greater than 0',
      });
    }

    // 5. Find the project
    const targetProject = await Project.findById(project);

    if (!targetProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // 6. Check project is open
    if (targetProject.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot apply to a project that is not open',
      });
    }

    // 7. Freelancer cannot apply to their own project
    if (targetProject.client.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot apply to your own project',
      });
    }

    // 8. Check for duplicate application
    const existingApplication = await Application.findOne({
      project,
      freelancer: req.user._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied to this project',
      });
    }

    // 9. Create the application
    const application = await Application.create({
      project,
      freelancer: req.user._id,
      proposal: proposal.trim(),
      bidAmount,
    });

    // 10. Push application ID into the project's applications array
    targetProject.applications.push(application._id);
    await targetProject.save();

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    // Handle duplicate key error (race condition fallback)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied to this project',
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
// @desc    Get applications by the logged-in freelancer
// @route   GET /api/applications/my
// @access  Private (freelancer only)
// ──────────────────────────────────────────────
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ freelancer: req.user._id })
      .populate('project', 'title description category budget deadline status client')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Get all applications for a specific project
// @route   GET /api/projects/:projectId/applications
// @access  Private (client — project owner only)
// ──────────────────────────────────────────────
const getProjectApplications = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // 1. Validate ObjectId
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

    // 3. Only the project owner can view its applications
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the project owner can view applications',
      });
    }

    // 4. Fetch applications
    const applications = await Application.find({ project: projectId })
      .populate('freelancer', 'name email profileImage skills rating')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Update application status (accept/reject)
// @route   PUT /api/applications/:id/status
// @access  Private (client — project owner only)
// ──────────────────────────────────────────────
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID',
      });
    }

    // 2. Validate status
    if (!status || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "accepted" or "rejected"',
      });
    }

    // 3. Find the application
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // 4. Find the related project
    const project = await Project.findById(application.project);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Related project not found',
      });
    }

    // 5. Only the project owner can change application status
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the project owner can update application status',
      });
    }

    // 6. Update the application status
    application.status = status;
    await application.save();

    // 7. If accepted: set project to in-progress & reject other pending applications
    if (status === 'accepted') {
      project.status = 'in-progress';
      await project.save();

      // Reject all other pending applications for this project
      await Application.updateMany(
        {
          project: application.project,
          _id: { $ne: application._id },
          status: 'pending',
        },
        { $set: { status: 'rejected' } }
      );
    }

    return res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      application,
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
// @desc    Get a single application by ID
// @route   GET /api/applications/:id
// @access  Private (related freelancer or project owner)
// ──────────────────────────────────────────────
const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID',
      });
    }

    // 2. Find the application and populate references
    const application = await Application.findById(id)
      .populate('project', 'title description category budget deadline status client')
      .populate('freelancer', 'name email profileImage skills rating');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // 3. Only the related freelancer or project owner can view it
    const isFreelancer = application.freelancer._id.toString() === req.user._id.toString();
    const isProjectOwner = application.project.client.toString() === req.user._id.toString();

    if (!isFreelancer && !isProjectOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own applications',
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getProjectApplications,
  updateApplicationStatus,
  getApplicationById,
};
