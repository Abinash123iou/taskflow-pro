/**
 * Global Error Handling Middleware for Express.
 * Catches all errors thrown in the request pipeline and returns consistent JSON responses.
 */
function errorHandler(err, req, res, next) {
  // Log the error stack for backend debugging
  console.error(`[Error] ${err.name || 'Error'}: ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  let statusCode = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let errors;

  // Handle Sequelize validation constraints
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map(e => e.message);
  }

  const errorResponse = {
    success: false,
    message
  };

  if (errors) {
    errorResponse.errors = errors;
  }

  // Expose stack trace only during local development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  return res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;
