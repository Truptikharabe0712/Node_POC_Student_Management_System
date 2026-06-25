/**
 * Student Routes
 * Defines all CRUD endpoint routes with express-validator validation rules.
 * Validation occurs before the controller handler is invoked.
 */
import express from "express";
import { body, param, query } from "express-validator";

import * as studentController from "../controllers/studentController.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

/**
 * Validation rules for student data (name, email, age, course).
 * Applied to POST and PUT requests.
 */
const studentValidationRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email must be in valid format"),
  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .bail()
    .isInt({ gt: 0 })
    .withMessage("Age must be greater than 0")
    .toInt(),
  body("course").trim().notEmpty().withMessage("Course is required"),
];

/**
 * Validation rules for student ID parameter.
 * Applied to GET/:id, PUT/:id, and DELETE/:id routes.
 */
const studentIdValidationRules = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Student id must be a positive integer")
    .toInt(),
];

/**
 * Validation rules for query parameters (pagination and search).
 * Applied to GET / route for filtering and pagination.
 */
const listValidationRules = [
  query("page").optional().isInt({ gt: 0 }).withMessage("Page must be greater than 0").toInt(),
  query("limit").optional().isInt({ gt: 0 }).withMessage("Limit must be greater than 0").toInt(),
];

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Students
 *     summary: Retrieve all students
 *     description: Fetches a list of all students with optional search and pagination support.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search students by name (case-insensitive, partial match)
 *         example: john
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination (must be greater than 0)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of records per page (must be greater than 0)
 *         example: 5
 *     responses:
 *       '200':
 *         description: Students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       '400':
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", listValidationRules, validateRequest, studentController.getAllStudents);

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Retrieve a student by ID
 *     description: Fetches a specific student record by their unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the student
 *         example: 1
 *     responses:
 *       '200':
 *         description: Student retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Invalid student ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '404':
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", studentIdValidationRules, validateRequest, studentController.getStudentById);

/**
 * @swagger
 * /:
 *   post:
 *     tags:
 *       - Students
 *     summary: Create a new student
 *     description: Creates a new student record with the provided information. Email must be unique.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - age
 *               - course
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the student
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address (must be unique)
 *                 example: john@example.com
 *               age:
 *                 type: integer
 *                 description: Age of the student (must be greater than 0)
 *                 example: 22
 *                 minimum: 1
 *               course:
 *                 type: string
 *                 description: Course enrolled by the student
 *                 example: Computer Science
 *     responses:
 *       '201':
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Validation error or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '409':
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", studentValidationRules, validateRequest, studentController.createStudent);

/**
 * @swagger
 * /{id}:
 *   put:
 *     tags:
 *       - Students
 *     summary: Update a student
 *     description: Updates an existing student record with the provided information. Email must be unique (if changed).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the student
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - age
 *               - course
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the student
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address (must be unique)
 *                 example: jane@example.com
 *               age:
 *                 type: integer
 *                 description: Age of the student (must be greater than 0)
 *                 example: 23
 *                 minimum: 1
 *               course:
 *                 type: string
 *                 description: Course enrolled by the student
 *                 example: Data Science
 *     responses:
 *       '200':
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Validation error or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '404':
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/:id",
  studentIdValidationRules.concat(studentValidationRules),
  validateRequest,
  studentController.updateStudent
);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     tags:
 *       - Students
 *     summary: Delete a student
 *     description: Deletes a specific student record by their unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the student
 *         example: 1
 *     responses:
 *       '200':
 *         description: Student deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Invalid student ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       '404':
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", studentIdValidationRules, validateRequest, studentController.deleteStudent);

export default router;
