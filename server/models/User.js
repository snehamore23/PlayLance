const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['client', 'freelancer'],
      message: 'Role must be either client or freelancer',
    },
    lowercase: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    default: '',
  },
  experience: {
    type: String,
    default: '',
  },
  portfolio: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
