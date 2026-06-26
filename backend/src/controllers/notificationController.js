const notificationService = require('../services/notificationService');

/**
 * Controller to fetch all notifications for the authenticated user.
 * GET /notifications
 */
async function getNotifications(req, res) {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: notifications
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Controller to mark a specific notification as read.
 * PUT /notifications/:id/read
 */
async function markRead(req, res) {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Controller to mark all notifications as read.
 * PUT /notifications/read-all
 */
async function markAllRead(req, res) {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: result
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Controller to delete a specific notification.
 * DELETE /notifications/:id
 */
async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    await notificationService.deleteNotification(id, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification
};
