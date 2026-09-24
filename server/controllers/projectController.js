const mongoose = require('mongoose');
const Project = require('../models/Project');

// Valid status values for filtering
const VALID_STATUSES = ['open', 'in-progress', 'completed', 'cancelled'];

// Fields a client is allowed to update
const ALLOWED_UPDATE_FIELDS = [
  'title',
  'description',
  'category',
  'skills',
  'budget',
  'deadline',
  'status',
];

// ──────────────────────────────────────────────
// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (client only)
// ──────────────────────────────────────────────
const createProject = async (req, res, next) => {
  try {
    const { title, description, category, skills, budget, deadline } = req.body;

    // 1. Validate required fields
    if (!title || !description || !category || budget === undefined || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, budget, and deadline',
      });
    }

    // 2. Validate budget
    if (typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget must be a number greater than 0',
      });
    }

    // 3. Validate deadline
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid deadline date',
      });
    }

    // 4. Validate skills if provided
    if (skills !== undefined) {
      if (!Array.isArray(skills) || !skills.every((s) => typeof s === 'string')) {
        return res.status(400).json({
          success: false,
          message: 'Skills must be an array of strings',
        });
      }
    }

    // 5. Create the project
    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      skills: skills || [],
      budget,
      deadline: deadlineDate,
      client: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
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
// @desc    Get all projects (with optional filters)
// @route   GET /api/projects
// @access  Public
// ──────────────────────────────────────────────
const getProjects = async (req, res, next) => {
  try {
    const filter = {};

    // Filter by category
    if (req.query.category) {
      filter.category = { $regex: new RegExp(req.query.category, 'i') };
    }

    // Filter by status
    if (req.query.status) {
      const status = req.query.status.toLowerCase();
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        });
      }
      filter.status = status;
    }

    // Filter by skills (comma-separated, match any)
    if (req.query.skills) {
      const skillsArray = req.query.skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillsArray };
    }

    const projects = await Project.find(filter)
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Public
// ──────────────────────────────────────────────
const getProjectById = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    const project = await Project.findById(req.params.id)
      .populate('client', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (client — owner only)
// ──────────────────────────────────────────────
const updateProject = async (req, res, next) => {
  try {
    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    // 2. Find the project
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // 3. Check ownership
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own projects',
      });
    }

    // 4. Build updates from allowed fields only
    const updates = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    // 5. Validate individual fields
    if (updates.title !== undefined) {
      if (typeof updates.title !== 'string' || !updates.title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty',
        });
      }
      updates.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      if (typeof updates.description !== 'string' || !updates.description.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Description cannot be empty',
        });
      }
      updates.description = updates.description.trim();
    }

    if (updates.category !== undefined) {
      if (typeof updates.category !== 'string' || !updates.category.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Category cannot be empty',
        });
      }
      updates.category = updates.category.trim();
    }

    if (updates.skills !== undefined) {
      if (!Array.isArray(updates.skills) || !updates.skills.every((s) => typeof s === 'string')) {
        return res.status(400).json({
          success: false,
          message: 'Skills must be an array of strings',
        });
      }
    }

    if (updates.budget !== undefined) {
      if (typeof updates.budget !== 'number' || updates.budget <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Budget must be a number greater than 0',
        });
      }
    }

    if (updates.deadline !== undefined) {
      const deadlineDate = new Date(updates.deadline);
      if (isNaN(deadlineDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid deadline date',
        });
      }
      updates.deadline = deadlineDate;
    }

    if (updates.status !== undefined) {
      if (!VALID_STATUSES.includes(updates.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        });
      }
    }

    // 6. Apply updates
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('client', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject,
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
// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (client — owner only)
// ──────────────────────────────────────────────
const deleteProject = async (req, res, next) => {
  try {
    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    // 2. Find the project
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // 3. Check ownership
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own projects',
      });
    }

    // 4. Delete
    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
