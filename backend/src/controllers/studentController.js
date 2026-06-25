/**
 * Student Controller
 * Handles HTTP request/response logic for student CRUD operations.
 * Each handler validates input via middleware, calls service layer, and returns standardized responses.
 */
import * as studentService from "../services/studentService.js";

/**
 * Create a new student record.
 * @param {Object} req - Express request object (body contains student data)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 */
async function createStudent(req, res, next) {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    // Pass to error handler middleware
    next(error);
  }
}

/**
 * Retrieve all students with optional filtering and pagination.
 * Query params: name (search), page (default 1), limit (default 10)
 */
async function getAllStudents(req, res, next) {
  try {
    const result = await studentService.getAllStudents(req.query);
    res.status(200).json({
      success: true,
      message: "Students retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieve a single student by ID.
 * Returns 404 if student not found.
 */
async function getStudentById(req, res, next) {
  try {
    const student = await studentService.getStudentById(Number(req.params.id));

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update an existing student record.
 * Returns 404 if student not found.
 * Email uniqueness is enforced by service layer.
 */
async function updateStudent(req, res, next) {
  try {
    const updatedStudent = await studentService.updateStudent(Number(req.params.id), req.body);

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Delete a student record.
 * Returns 404 if student not found.
 */
async function deleteStudent(req, res, next) {
  try {
    const deletedStudent = await studentService.deleteStudent(Number(req.params.id));

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: deletedStudent,
    });
  } catch (error) {
    return next(error);
  }
}

export {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
