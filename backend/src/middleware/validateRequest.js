/**
 * Validation Middleware
 * Checks validation results from express-validator and formats error responses.
 * Converts validation errors into a consistent error response format with field-level details.
 */
import { validationResult } from "express-validator";

function validateRequest(req, res, next) {
  // Retrieve validation errors from express-validator chains
  const errors = validationResult(req);

  // If no errors found, proceed to next middleware/handler
  if (errors.isEmpty()) {
    return next();
  }

  // Return 400 with structured error response
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    // Map errors to include field path and message for client-side display
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
}

export default validateRequest;
