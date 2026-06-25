/**
 * Express Application Setup
 * Configures middleware, health endpoint, routes, and error handling.
 */

import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger.js";
import studentRoutes from "./routes/studentRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import notFoundHandler from "./middleware/notFoundHandler.js";

const app = express();

// Enable CORS to allow frontend requests from different origins
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());
// Log all incoming requests (timestamp, method, URL)
app.use(loggerMiddleware);

/**
 * @swagger
 * /health:4
 *   get:
 *     tags:
 *       - Health
 *     summary: Service health check
 *     description: Verifies that the API service is running and responsive.
 *     responses:
 *       '200':
 *         description: Service is healthy and operational
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 data:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-17T10:30:00.000Z"
 */
// Health check endpoint - used to verify service is running
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Service is healthy",
    data: {
      timestamp: new Date().toISOString(),
    },
  });
});

// Swagger UI - API Documentation
// Access at http://localhost:5000/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON endpoint - raw API specification
// Access at http://localhost:5000/api-spec
app.get("/api-spec", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// All student-related endpoints (CRUD operations)
app.use("/students", studentRoutes);

// Catch-all 404 handler for undefined routes
app.use(notFoundHandler);
// Centralized error handler for all route errors
app.use(errorHandler);

export default app;
