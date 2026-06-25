/**
 * 404 Not Found Handler
 * Handles requests to undefined routes with a standard error response.
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: "Resource not found",
    errors: [],
  });
}

export default notFoundHandler;
