/**
 * Centralized Error Handler
 * Catches all errors thrown in route handlers and formats consistent error responses.
 * Logs errors to console and returns appropriate HTTP status codes.
 * Must have 4 parameters (error, req, res, next) to be recognized as error middleware.
 */
function errorHandler(error, req, res, next) {
  // Log full error details for debugging
  console.error(error);

  // Use error.statusCode if set (custom business logic errors), otherwise 500
  const statusCode = Number(error.statusCode) || 500;
  // Don't expose internal error details for 500 errors; show generic message
  const message = statusCode === 500 ? "Internal server error" : error.message;

  res.status(statusCode).json({
    success: false,
    message,
    errors: [error.message],
  });
}

export default errorHandler;
