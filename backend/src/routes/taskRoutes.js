const express = require('express');
const router = express.Router();

const {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
  getStatsController
} = require('../controllers/taskController');

const {
  validateTaskCreation,
  validateTaskStatusUpdate
} = require('../middleware/validateTask');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all task endpoints with JWT verification
router.use(authMiddleware);

// Dashboard statistics (Placed first to avoid any potential route matching conflicts)
router.get('/tasks/stats', getStatsController);

// Fetch all tasks (supports query parameters: status, search)
router.get('/tasks', getTasksController);

// Create a new task
router.post('/tasks', validateTaskCreation, createTaskController);

// Update a task's status
router.put('/tasks/:id', validateTaskStatusUpdate, updateTaskController);

// Delete a task
router.delete('/tasks/:id', deleteTaskController);

module.exports = router;
