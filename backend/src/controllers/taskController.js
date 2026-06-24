const taskService = require('../services/taskService');

/**
 * Controller to handle task creation.
 * POST /tasks
 */
async function createTaskController(req, res) {
  try {
    const { title, description, status } = req.body;
    const task = await taskService.createTask({ title, description, status });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    const statusCode = error.name === 'SequelizeValidationError' ? 400 : (error.status || 500);
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Controller to fetch all tasks with optional search and status filter.
 * GET /tasks
 */
async function getTasksController(req, res) {
  try {
    const { status, search } = req.query;
    const tasks = await taskService.getAllTasks({ status, search });

    return res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Controller to update a task's status.
 * PUT /tasks/:id
 */
async function updateTaskController(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTask = await taskService.updateTaskStatus(id, status);

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    const statusCode = error.name === 'SequelizeValidationError' ? 400 : (error.status || 500);
    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Controller to delete a task.
 * DELETE /tasks/:id
 */
async function deleteTaskController(req, res) {
  try {
    const { id } = req.params;
    const result = await taskService.deleteTask(id);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: null
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * Controller to fetch dashboard task statistics.
 * GET /tasks/stats
 */
async function getStatsController(req, res) {
  try {
    const stats = await taskService.getDashboardStats();

    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
  getStatsController
};
