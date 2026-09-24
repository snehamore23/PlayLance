const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required'],
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Freelancer is required'],
  },
  proposal: {
    type: String,
    required: [true, 'Proposal is required'],
    trim: true,
  },
  bidAmount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [1, 'Bid amount must be greater than 0'],
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'accepted', 'rejected'],
      message: 'Status must be one of: pending, accepted, rejected',
    },
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent a freelancer from applying to the same project twice
applicationSchema.index({ project: 1, freelancer: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
