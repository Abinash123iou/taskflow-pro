const { Op } = require('sequelize');
const Task = require('../models/Task');

/**
 * Creates a new task.
 * @param {Object} taskData - Fields for the task (title, description, status).
 * @returns {Promise<Object>} The created task instance.
 */
async function createTask(taskData) {
  return await Task.create(taskData);
}

/**
 * Retrieves all tasks, applying optional filters.
 * @param {Object} filters - Optional query parameters.
 * @param {string} [filters.status] - Filter by status (Pending, In Progress, Completed).
 * @param {string} [filters.search] - Search term matched against task title.
 * @returns {Promise<Array>} List of task instances.
 */
async function getAllTasks(filters = {}) {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.search) {
    where.title = {
      [Op.substring]: filters.search
    };
  }

  return await Task.findAll({
    where,
    order: [['created_at', 'DESC']] // Returns newest tasks first
  });
}

/**
 * Updates the status of a specific task.
 * @param {number|string} taskId - The primary key ID of the task.
 * @param {string} status - The new status value.
 * @returns {Promise<Object>} The updated task instance.
 */
async function updateTaskStatus(taskId, status) {
  const task = await Task.findByPk(taskId);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }

  task.status = status;
  await task.save();
  return task;
}

/**
 * Deletes a specific task.
 * @param {number|string} taskId - The primary key ID of the task.
 * @returns {Promise<Object>} Success message payload.
 */
async function deleteTask(taskId) {
  const task = await Task.findByPk(taskId);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }

  await task.destroy();
  return { message: 'Task deleted successfully' };
}

/**
 * Calculates high-level dashboard statistics for tasks.
 * @returns {Promise<Object>} Statistics containing total and status-specific counts.
 */
async function getDashboardStats() {
  const [totalTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
    Task.count(),
    Task.count({ where: { status: 'Pending' } }),
    Task.count({ where: { status: 'In Progress' } }),
    Task.count({ where: { status: 'Completed' } })
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
