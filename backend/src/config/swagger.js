/**
 * Swagger Configuration
 * Defines the OpenAPI 3.0 specification for the Student Management REST API
 */
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Management REST API",
      version: "1.0.0",
      description: "A RESTful API for managing student records with full CRUD operations, validation, and optional features like search and pagination.",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
      {
        url: "http://localhost:3000",
        description: "Alternative Development Server",
      },
    ],
    components: {
      schemas: {
        Student: {
          type: "object",
          required: ["name", "email", "age", "course"],
          properties: {
            id: {
              type: "integer",
              description: "Auto-generated unique student identifier",
              example: 1,
            },
            name: {
              type: "string",
              description: "Full name of the student",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address of the student (must be unique)",
              example: "john@example.com",
            },
            age: {
              type: "integer",
              description: "Age of the student (must be greater than 0)",
              example: 22,
              minimum: 1,
            },
            course: {
              type: "string",
              description: "Course enrolled by the student",
              example: "Computer Science",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              oneOf: [
                { $ref: "#/components/schemas/Student" },
                { type: "object" },
              ],
            },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Students retrieved successfully",
            },
            data: {
              type: "object",
              properties: {
                students: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Student" },
                },
                pagination: {
                  type: "object",
                  properties: {
                    total: {
                      type: "integer",
                      example: 10,
                    },
                    page: {
                      type: "integer",
                      example: 1,
                    },
                    limit: {
                      type: "integer",
                      example: 5,
                    },
                  },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                  },
                  message: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Validation failed",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    example: "email",
                  },
                  message: {
                    type: "string",
                    example: "Email must be in valid format",
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Service health check",
      },
      {
        name: "Students",
        description: "Student CRUD operations",
      },
    ],
  },
  apis: ["./src/routes/studentRoutes.js", "./src/app.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
