const Project = require('../models/Project');
const Application = require('../models/Application');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const User = require('../models/User');

// ──────────────────────────────────────────────
// @desc    Get dashboard metrics for logged-in user
// @route   GET /api/dashboard
// @access  Private
// ──────────────────────────────────────────────
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role || 'freelancer';

    // Fetch unread notifications count for any user
    const unreadNotifications = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    // Fetch recent notifications for recent activity stream
    const notificationsList = await Notification.find({ recipient: userId })
      .populate('sender', 'name email profileImage')
      .populate('relatedProject', 'title status')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const recentActivity = notificationsList.map((n) => ({
      id: n._id,
      title: n.type
        ? n.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
        : 'Notification',
      desc: n.message,
      createdAt: n.createdAt,
      type: n.type,
      sender: n.sender,
      relatedProject: n.relatedProject,
      relatedApplication: n.relatedApplication,
    }));

    if (role === 'client') {
      // ────────────────── CLIENT DASHBOARD ──────────────────
      const clientProjects = await Project.find({ client: userId })
        .sort({ createdAt: -1 })
        .lean();

      const totalProjects = clientProjects.length;
      const activeProjects = clientProjects.filter((p) => p.status === 'in-progress').length;
      const completedProjects = clientProjects.filter((p) => p.status === 'completed').length;

      const projectIds = clientProjects.map((p) => p._id);

      // Fetch all applications submitted for client's projects
      const clientApplications = await Application.find({ project: { $in: projectIds } })
        .populate('freelancer', 'name email profileImage rating')
        .populate('project', 'title budget status')
        .sort({ createdAt: -1 })
        .lean();

      const applicationsReceived = clientApplications.length;

      // Calculate total spent from completed payments
      const clientPayments = await Payment.find({ client: userId, status: 'paid' }).lean();
      const totalSpent = clientPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      // Format recent projects with application counts
      const recentProjects = clientProjects.slice(0, 5).map((p) => ({
        _id: p._id,
        title: p.title,
        description: p.description,
        budget: p.budget,
        deadline: p.deadline,
        status: p.status,
        applicationsCount: Array.isArray(p.applications) ? p.applications.length : 0,
        createdAt: p.createdAt,
      }));

      // Format recent applications
      const recentApplications = clientApplications.slice(0, 5).map((a) => ({
        _id: a._id,
        project: a.project,
        freelancer: a.freelancer,
        proposal: a.proposal,
        bidAmount: a.bidAmount,
        status: a.status,
        createdAt: a.createdAt,
      }));

      return res.status(200).json({
        success: true,
        role: 'client',
        stats: {
          totalProjects,
          activeProjects,
          completedProjects,
          applicationsReceived,
          totalSpent,
          unreadNotifications,
        },
        recentProjects,
        recentApplications,
        activeProjects: [],
        recentActivity,
      });
    } else {
      // ────────────────── FREELANCER DASHBOARD ──────────────────
      const freelancerApps = await Application.find({ freelancer: userId })
        .populate('project', 'title budget deadline status client')
        .sort({ createdAt: -1 })
        .lean();

      const proposalsSubmitted = freelancerApps.length;

      // Filter applications where application status is accepted
      const acceptedApps = freelancerApps.filter((a) => a.status === 'accepted');

      const activeProjectsCount = acceptedApps.filter(
        (a) => a.project && a.project.status === 'in-progress'
      ).length;

      const completedProjectsCount = acceptedApps.filter(
        (a) => a.project && a.project.status === 'completed'
      ).length;

      // Fetch user's rating
      const userDoc = await User.findById(userId).select('rating').lean();
      const rating = userDoc?.rating || 0;

      // Calculate total earnings from completed payments
      const freelancerPayments = await Payment.find({ freelancer: userId, status: 'paid' }).lean();
      const totalEarnings = freelancerPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      // Fetch full active project objects for freelancer
      const acceptedProjIds = acceptedApps
        .map((a) => (a.project ? (a.project._id || a.project) : null))
        .filter(Boolean);

      const activeProjects = await Project.find({ _id: { $in: acceptedProjIds } })
        .populate('client', 'name email profileImage')
        .sort({ createdAt: -1 })
        .lean();

      // Format recent applications
      const recentApplications = freelancerApps.slice(0, 5).map((a) => ({
        _id: a._id,
        project: a.project,
        proposal: a.proposal,
        bidAmount: a.bidAmount,
        status: a.status,
        createdAt: a.createdAt,
      }));

      return res.status(200).json({
        success: true,
        role: 'freelancer',
        stats: {
          totalEarnings,
          activeProjects: activeProjectsCount,
          completedProjects: completedProjectsCount,
          proposalsSubmitted,
          rating,
          unreadNotifications,
        },
        recentProjects: [],
        recentApplications,
        activeProjects,
        recentActivity,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
};
