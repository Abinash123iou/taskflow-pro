const { Op } = require('sequelize');
const Task = require('../models/Task');

/**
 * Creates a new task associated with a user.
 * @param {Object} taskData - Fields for the task (title, description, status).
 * @param {number} userId - The owner of the task.
 * @returns {Promise<Object>} The created task instance.
 */
async function createTask(taskData, userId) {
  return await Task.create({ ...taskData, userId });
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

  await task.destroy();
  return { message: 'Task deleted successfully' };
}

/**
 * Calculates dashboard statistics for tasks belonging to a specific user.
 * @param {number} userId - The owner of the tasks.
 * @returns {Promise<Object>} Statistics containing total and status-specific counts.
 */
async function getDashboardStats(userId) {
  const [totalTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
    Task.count({ where: { userId } }),
    Task.count({ where: { status: 'Pending', userId } }),
    Task.count({ where: { status: 'In Progress', userId } }),
    Task.count({ where: { status: 'Completed', userId } })
  ]);

  return {
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks
  };
}

module.exports = {
  createTask,
  getAllTasks,
  updateTaskStatus,
  deleteTask,
  getDashboardStats
};
