const Notification = require('../models/Notification');

/**
 * Helper function to create a new notification document
 *
 * @param {Object} params
 * @param {ObjectId|string} params.recipient - User receiving the notification
 * @param {ObjectId|string} [params.sender] - User generating the notification
 * @param {string} params.type - Type of notification (e.g. APPLICATION_RECEIVED)
 * @param {string} params.message - Notification message
 * @param {ObjectId|string} [params.relatedProject] - Associated Project ID
 * @param {ObjectId|string} [params.relatedApplication] - Associated Application ID
 */
const createNotification = async ({
  recipient,
  sender = null,
  type,
  message,
  relatedProject = null,
  relatedApplication = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender: sender || null,
      type,
      message,
      relatedProject: relatedProject || null,
      relatedApplication: relatedApplication || null,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    return null;
  }
};

module.exports = createNotification;
