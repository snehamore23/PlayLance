const User = require('../models/User');

// Fields the user is allowed to update
const ALLOWED_UPDATE_FIELDS = [
  'name',
  'profileImage',
  'bio',
  'skills',
  'location',
  'experience',
  'portfolio',
];

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        skills: user.skills,
        location: user.location,
        experience: user.experience,
        portfolio: user.portfolio,
        rating: user.rating,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    // 1. Build an object with only allowed fields from the request body
    const updates = {};

    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // 2. Check if there is anything to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    // 3. Validate individual fields
    if (updates.name !== undefined) {
      if (typeof updates.name !== 'string' || !updates.name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty',
        });
      }
      updates.name = updates.name.trim();
    }

    if (updates.profileImage !== undefined && typeof updates.profileImage !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Profile image must be a string',
      });
    }

    if (updates.bio !== undefined && typeof updates.bio !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Bio must be a string',
      });
    }

    if (updates.skills !== undefined) {
      if (!Array.isArray(updates.skills)) {
        return res.status(400).json({
          success: false,
          message: 'Skills must be an array of strings',
        });
      }
      if (!updates.skills.every((s) => typeof s === 'string')) {
        return res.status(400).json({
          success: false,
          message: 'Each skill must be a string',
        });
      }
    }

    if (updates.location !== undefined && typeof updates.location !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Location must be a string',
      });
    }

    if (updates.experience !== undefined && typeof updates.experience !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Experience must be a string',
      });
    }

    if (updates.portfolio !== undefined) {
      if (!Array.isArray(updates.portfolio)) {
        return res.status(400).json({
          success: false,
          message: 'Portfolio must be an array of strings',
        });
      }
      if (!updates.portfolio.every((p) => typeof p === 'string')) {
        return res.status(400).json({
          success: false,
          message: 'Each portfolio item must be a string',
        });
      }
    }

    // 4. Find and update user, return the updated document without password
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        location: updatedUser.location,
        experience: updatedUser.experience,
        portfolio: updatedUser.portfolio,
        rating: updatedUser.rating,
      },
    });
  } catch (error) {
    // Handle mongoose validation errors
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

module.exports = {
  getUserProfile,
  updateUserProfile,
};
