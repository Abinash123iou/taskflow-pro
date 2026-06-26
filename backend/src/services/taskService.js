const { Op } = require('sequelize');
const Task = require('../models/Task');
const notificationService = require('./notificationService');

/**
 * Creates a new task associated with a user.
 * @param {Object} taskData - Fields for the task (title, description, status).
 * @param {number} userId - The owner of the task.
 * @returns {Promise<Object>} The created task instance.
 */
async function createTask(taskData, userId) {
  const task = await Task.create({ ...taskData, userId });
  await notificationService.createNotification(userId, {
    title: 'Task Created',
    message: `You created a new task: "${task.title}".`,
    type: 'Success'
  }).catch(err => console.error('Failed to create notification:', err));
  return task;
}

/**
 * Retrieves all tasks for a specific user, applying optional filters and pagination.
 * @param {Object} filters - Optional query parameters.
 * @param {string} [filters.status] - Filter by status.
 * @param {string} [filters.search] - Search term matched against task title.
 * @param {number|string} [filters.page] - Page number for pagination (default: 1).
 * @param {number|string} [filters.limit] - Max records per page (default: 10).
 * @param {number} userId - The owner of the tasks.
 * @returns {Promise<Object>} Object containing tasks list and pagination metadata.
 */
async function getAllTasks(filters = {}, userId) {
  const where = { userId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.search) {
    where.title = {
      [Op.substring]: filters.search
    };
  }

  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const { count, rows } = await Task.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']] // Returns newest tasks first
  });

  const totalPages = Math.ceil(count / limit);

  return {
    tasks: rows,
    totalTasks: count,
    totalPages,
    currentPage: page,
    limit
  };
}

/**
 * Updates the fields of a specific task (supports full edits and status-only updates).
 * @param {number|string} taskId - The primary key ID of the task.
 * @param {Object|string} updateData - The new status value string or an object containing fields to update.
 * @param {number} userId - The owner of the task.
 * @returns {Promise<Object>} The updated task instance.
 */
async function updateTaskStatus(taskId, updateData, userId) {
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }

  const oldStatus = task.status;
  const oldPriority = task.priority;

  if (typeof updateData === 'string') {
    task.status = updateData;
  } else if (updateData && typeof updateData === 'object') {
    if (updateData.title !== undefined) task.title = updateData.title;
    if (updateData.description !== undefined) task.description = updateData.description;
    if (updateData.status !== undefined) task.status = updateData.status;
    if (updateData.priority !== undefined) task.priority = updateData.priority;
    if (updateData.dueDate !== undefined) {
      task.dueDate = updateData.dueDate === '' ? null : updateData.dueDate;
    }
  }

  await task.save();

  // Create notification if status or priority changed
  let changes = [];
  if (task.status !== oldStatus) {
    changes.push(`status changed to "${task.status}"`);
  }
  if (task.priority !== oldPriority) {
    changes.push(`priority changed to "${task.priority}"`);
  }

  if (changes.length > 0) {
    await notificationService.createNotification(userId, {
      title: 'Task Updated',
      message: `Task "${task.title}" has been updated: ${changes.join(' and ')}.`,
      type: 'Info'
    }).catch(err => console.error('Failed to create notification:', err));
  }

  return task;
}

/**
 * Deletes a specific task.
 * @param {number|string} taskId - The primary key ID of the task.
 * @param {number} userId - The owner of the task.
 * @returns {Promise<Object>} Success message payload.
 */
async function deleteTask(taskId, userId) {
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }

  const title = task.title;
  await task.destroy();

  // Create notification
  await notificationService.createNotification(userId, {
    title: 'Task Deleted',
    message: `You deleted the task: "${title}".`,
    type: 'Warning'
  }).catch(err => console.error('Failed to create notification:', err));

  return { message: 'Task deleted successfully' };
}

/**
 * Calculates dashboard statistics for tasks belonging to a specific user.
 * @param {number} userId - The owner of the tasks.
 * @returns {Promise<Object>} Statistics containing total and status-specific counts.
 */
async function getDashboardStats(userId) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Fetch all tasks for this user to calculate statistics in memory (reducing DB roundtrips)
  const tasks = await Task.findAll({ where: { userId } });

  let totalTasks = tasks.length;
  let pendingTasks = 0;
  let inProgressTasks = 0;
  let completedTasks = 0;
  let overdueTasks = 0;
  const overdueTasksList = [];

  tasks.forEach(task => {
    if (task.status === 'Pending') pendingTasks++;
    else if (task.status === 'In Progress') inProgressTasks++;
    else if (task.status === 'Completed') completedTasks++;

    if (task.status !== 'Completed' && task.dueDate && task.dueDate < todayStr) {
      overdueTasks++;
      overdueTasksList.push(task);
    }
  });

  // Check and create notifications for recently overdue tasks (avoiding duplicate notifications)
  if (overdueTasksList.length > 0) {
    const Notification = require('../models/Notification');
    const existingOverdueNotifications = await Notification.findAll({
      where: {
        userId,
        title: 'Task Overdue'
      }
    });

    for (const task of overdueTasksList) {
      const hasNotification = existingOverdueNotifications.some(n => n.message.includes(`"${task.title}"`));
      if (!hasNotification) {
        await notificationService.createNotification(userId, {
          title: 'Task Overdue',
          message: `Task "${task.title}" is overdue (due date was ${task.dueDate}).`,
          type: 'Warning'
        }).catch(err => console.error('Failed to create notification:', err));
      }
    }
  }

  // Calculate Weekly Completion Trend (current week: Monday to Sunday)
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const weeklyData = daysOfWeek.map((dayName, index) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);
    const dayDateStr = dayDate.toISOString().split('T')[0];

    const completedOnDay = tasks.filter(task => {
      if (task.status !== 'Completed') return false;
      const completedDateStr = new Date(task.updatedAt).toISOString().split('T')[0];
      return completedDateStr === dayDateStr;
    }).length;

    const dueOnDay = tasks.filter(task => {
      return task.dueDate === dayDateStr;
    }).length;

    return {
      name: dayName,
      Completed: completedOnDay,
      Projected: dueOnDay
    };
  });

  // Calculate Monthly Productivity Trend (last 6 months ending in current month)
  const monthlyData = [];
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(now.getMonth() - i);
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = monthNames[month];

    const tasksInMonth = tasks.filter(task => {
      const createdDate = new Date(task.createdAt);
      return createdDate.getFullYear() < year || 
             (createdDate.getFullYear() === year && createdDate.getMonth() <= month);
    });

    const completedInMonth = tasksInMonth.filter(task => {
      if (task.status !== 'Completed') return false;
      const completedDate = new Date(task.updatedAt);
      return completedDate.getFullYear() === year && completedDate.getMonth() === month;
    }).length;

    const totalCount = tasksInMonth.length;
    const productivityRate = totalCount > 0 ? Math.round((completedInMonth / totalCount) * 100) : 0;

    monthlyData.push({
      name: label,
      Productivity: productivityRate
    });
  }

  return {
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    overdueTasks,
    weeklyData,
    monthlyData
  };
}

module.exports = {
  createTask,
  getAllTasks,
  updateTaskStatus,
  deleteTask,
  getDashboardStats
};
