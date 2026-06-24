/**
 * Validates the request body for creating a task.
 * Rules:
 * - title: required, non-empty string, min 3 characters
 * - description: required, min 20 characters
 * - status: required, must be 'Pending', 'In Progress', or 'Completed'
 */
function validateTaskCreation(req, res, next) {
  const { title, description, status } = req.body;
  const errors = [];

  // Validate Title
  if (title === undefined || title === null) {
    errors.push('Title is required');
  } else if (typeof title !== 'string' || title.trim() === '') {
    errors.push('Title cannot be empty');
  } else if (title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  // Validate Description
  if (description === undefined || description === null) {
    errors.push('Description is required');
  } else if (typeof description !== 'string' || description.trim().length < 20) {
    errors.push('Description must be at least 20 characters');
  }

  // Validate Status
  const allowedStatuses = ['Pending', 'In Progress', 'Completed'];
  if (status === undefined || status === null) {
    errors.push('Status is required');
  } else if (!allowedStatuses.includes(status)) {
    errors.push('Status must be Pending, In Progress, or Completed');
  }

  // If there are errors, return a 400 response matching the requested error format
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  next();
}

/**
 * Validates the request body for updating task status.
 * Rules:
 * - status: required, must be 'Pending', 'In Progress', or 'Completed'
 */
function validateTaskStatusUpdate(req, res, next) {
  const { status } = req.body;
  const errors = [];
  const allowedStatuses = ['Pending', 'In Progress', 'Completed'];

  if (status === undefined || status === null) {
    errors.push('Status is required');
  } else if (!allowedStatuses.includes(status)) {
    errors.push('Status must be Pending, In Progress, or Completed');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  next();
}

module.exports = {
  validateTaskCreation,
  validateTaskStatusUpdate
};
