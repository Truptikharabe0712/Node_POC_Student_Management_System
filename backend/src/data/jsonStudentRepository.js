/**
 * JSON Repository Implementation
 * Uses in-memory student state backed by a JSON file on disk.
 * Supports create, read, update, delete, filtering, and pagination.
 */
import {
  getStudents,
  getNextStudentId,
  saveStudents,
  loadStudents,
} from "./studentStore.js";

function createDuplicateEmailError() {
  const error = new Error("Email already exists");
  error.statusCode = 409;
  return error;
}

function isEmailTaken(email, excludeStudentId) {
  const normalizedEmail = email.trim().toLowerCase();

  return getStudents().some(
    (student) => student.email === normalizedEmail && student.id !== excludeStudentId
  );
}

/**
 * Load student data from JSON file into memory before handling requests.
 */
async function initialize() {
  await loadStudents();
}

/**
 * Create a new student and persist the updated list to JSON file.
 */
async function createStudent(studentData) {
  if (isEmailTaken(studentData.email)) {
    throw createDuplicateEmailError();
  }

  const students = getStudents();
  const student = {
    id: getNextStudentId(),
    name: studentData.name.trim(),
    email: studentData.email.trim().toLowerCase(),
    age: Number(studentData.age),
    course: studentData.course.trim(),
  };

  students.push(student);
  await saveStudents();
  return student;
}

/**
 * Return a paginated list of students and total count from memory.
 */
async function getAllStudents(filters) {
  const students = getStudents();
  const searchName = typeof filters.name === "string" ? filters.name.trim().toLowerCase() : "";
  const page = Number(filters.page) > 0 ? Number(filters.page) : 1;
  const limit = Number(filters.limit) > 0 ? Number(filters.limit) : 5;

  const filteredStudents = searchName
    ? students.filter((student) => student.name.toLowerCase().includes(searchName))
    : [...students];

  const startIndex = (page - 1) * limit;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + limit);

  return {
    students: paginatedStudents,
    pagination: {
      total: filteredStudents.length,
      page,
      limit,
    },
  };
}

/**
 * Retrieve a student record by its numeric ID.
 */
async function getStudentById(studentId) {
  const students = getStudents();
  return students.find((student) => student.id === studentId) || null;
}

/**
 * Update an existing student and persist changes.
 */
async function updateStudent(studentId, studentData) {
  const students = getStudents();
  const studentIndex = students.findIndex((student) => student.id === studentId);

  if (studentIndex === -1) {
    return null;
  }

  if (isEmailTaken(studentData.email, studentId)) {
    throw createDuplicateEmailError();
  }

  const updatedStudent = {
    id: studentId,
    name: studentData.name.trim(),
    email: studentData.email.trim().toLowerCase(),
    age: Number(studentData.age),
    course: studentData.course.trim(),
  };

  students[studentIndex] = updatedStudent;
  await saveStudents();
  return updatedStudent;
}

/**
 * Delete a student from memory and persist the updated list.
 */
async function deleteStudent(studentId) {
  const students = getStudents();
  const studentIndex = students.findIndex((student) => student.id === studentId);

  if (studentIndex === -1) {
    return null;
  }

  const [deletedStudent] = students.splice(studentIndex, 1);
  await saveStudents();
  return deletedStudent;
}

export {
  initialize,
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
