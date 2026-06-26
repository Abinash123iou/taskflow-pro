const Notification = require('../models/Notification');

/**
 * Creates a new notification for a user.
 * @param {number} userId - The user receiving the notification.
 * @param {Object} data - Payload containing title, message, and type.
 * @returns {Promise<Object>} Created notification.
 */
async function createNotification(userId, { title, message, type = 'Info' }) {
  return await Notification.create({
    userId,
    title,
    message,
    type
  });
}

/**
 * Fetches all notifications for a user, sorted by most recent first.
 * @param {number} userId - User identifier.
 * @returns {Promise<Array>} List of notifications.
 */
async function getUserNotifications(userId) {
  return await Notification.findAll({
    where: { userId },
    order: [['created_at', 'DESC']]
  });
}

/**
 * Marks a specific notification as read.
 * @param {number} notificationId - Notification ID.
 * @param {number} userId - User ID (to verify ownership).
 * @returns {Promise<Object>} Updated notification.
 */
async function markAsRead(notificationId, userId) {
  const notification = await Notification.findOne({
    where: { id: notificationId, userId }
  });

  if (!notification) {
    const error = new Error('Notification not found');
    error.status = 404;
    throw error;
  }

  notification.isRead = true;
  await notification.save();
  return notification;
}

/**
 * Marks all notifications of a user as read.
 * @param {number} userId - User ID.
 * @returns {Promise<Object>} Operation details count.
 */
async function markAllAsRead(userId) {
  const [affectedCount] = await Notification.update(
    { isRead: true },
    { where: { userId, isRead: false } }
  );
  return { affectedCount };
}

/**
 * Deletes a specific notification.
 * @param {number} notificationId - Notification ID.
 * @param {number} userId - User ID (to verify ownership).
 * @returns {Promise<Object>} Success status message.
 */
async function deleteNotification(notificationId, userId) {
  const notification = await Notification.findOne({
    where: { id: notificationId, userId }
  });

  if (!notification) {
    const error = new Error('Notification not found');
    error.status = 404;
    throw error;
  }

  await notification.destroy();
  return { message: 'Notification deleted successfully' };
}

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
