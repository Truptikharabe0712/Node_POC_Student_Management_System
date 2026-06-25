/**
 * Logging Middleware
 * Logs all incoming HTTP requests with timestamp, method, and URL.
 * Useful for debugging and monitoring API activity.
 */
function loggerMiddleware(req, res, next) {
  const timestamp = new Date().toISOString();
  // Log format: [ISO timestamp] [HTTP method] [request path]
  console.log(`${timestamp} ${req.method} ${req.originalUrl}`);
  next();
}

export default loggerMiddleware;
