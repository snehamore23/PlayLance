/**
 * Role-Based Access Control Middleware
 *
 * Usage:
 *   allowRoles("client")
 *   allowRoles("freelancer")
 *   allowRoles("client", "freelancer")
 *
 * Must be used after the `protect` middleware so that req.user is available.
 */

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }
    next();
  };
};

module.exports = { allowRoles };
