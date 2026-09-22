const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if Authorization header is missing
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing',
    });
  }

  // 2. Check if token format is invalid (must start with "Bearer ")
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token',
    });
  }

  try {
    // 3. Verify JWT using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user by decoded userId and exclude password
    const user = await User.findById(decoded.userId || decoded.id).select('-password');

    // 5. If user does not exist in MongoDB
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // 6. Attach user to req.user (without password)
    req.user = user;
    next();
  } catch (error) {
    // 7. Handle expired or invalid JWT tokens
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token',
    });
  }
};

module.exports = { protect };
