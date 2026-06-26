/**
 * PostgreSQL Repository Implementation
 * Persists student records in a Postgres table and exposes the same CRUD API
 * as the JSON repository so storage mode can be changed without affecting services.
 */
import { Pool } from "pg";

let pool;

function createDuplicateEmailError() {
  const error = new Error("Email already exists");
  error.statusCode = 409;
  return error;
}

/**
 * Build the Postgres connection configuration from environment variables.
 * Supports DATABASE_URL or explicit host/user/password settings.
 */
function getPoolConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
    };
  }

  if (
    process.env.DB_HOST &&
    process.env.DB_PORT &&
    process.env.DB_NAME &&
    process.env.DB_USER &&
    process.env.DB_PASSWORD
  ) {
    return {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    };
  }

  throw new Error(
    "PostgreSQL configuration is missing. Set DATABASE_URL or DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD"
  );
}

/**
 * Lazily initialize and return the Postgres connection pool.
 */
function getPool() {
  if (!pool) {
    pool = new Pool(getPoolConfig());
  }

  return pool;
}

/**
 * Ensure the students table exists before handling CRUD requests.
 */
async function initialize() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      age INTEGER NOT NULL CHECK (age > 0),
      course VARCHAR(255) NOT NULL
    )
  `);
}

/**
 * Create a new student row in Postgres.
 * Email uniqueness is enforced via a pre-check to return a user-friendly conflict error.
 */
async function createStudent(studentData) {
  const normalizedEmail = studentData.email.trim().toLowerCase();

  const emailExistsResult = await getPool().query("SELECT 1 FROM students WHERE email = $1 LIMIT 1", [
    normalizedEmail,
  ]);

  if (emailExistsResult.rowCount > 0) {
    throw createDuplicateEmailError();
  }

  const query = `
    INSERT INTO students (name, email, age, course)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, age, course
  `;

  const values = [
    studentData.name.trim(),
    normalizedEmail,
    Number(studentData.age),
    studentData.course.trim(),
  ];

  const result = await getPool().query(query, values);
  return result.rows[0];
}

/**
 * Return a paginated list of students with optional name search.
 */
async function getAllStudents(filters) {
  const searchName = typeof filters.name === "string" ? filters.name.trim() : "";
  const page = Number(filters.page) > 0 ? Number(filters.page) : 1;
  const limit = Number(filters.limit) > 0 ? Number(filters.limit) : 5;
  const offset = (page - 1) * limit;

  let countQuery = "SELECT COUNT(*)::int AS total FROM students";
  let dataQuery = "SELECT id, name, email, age, course FROM students";
  const whereClauses = [];
  const countParams = [];

  if (searchName) {
    countParams.push(`%${searchName}%`);
    whereClauses.push(`name ILIKE $${countParams.length}`);
  }

  if (whereClauses.length > 0) {
    // Reuse the same WHERE fragment for both count and data queries.
    const whereSql = ` WHERE ${whereClauses.join(" AND ")}`;
    countQuery += whereSql;
    dataQuery += whereSql;
  }

  // Keep LIMIT/OFFSET parameterized to avoid SQL injection and preserve plan reuse.
  const dataParams = [...countParams, limit, offset];
  dataQuery += ` ORDER BY id ASC LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`;

  const [countResult, dataResult] = await Promise.all([
    getPool().query(countQuery, countParams),
    getPool().query(dataQuery, dataParams),
  ]);

  return {
    students: dataResult.rows,
    pagination: {
      total: countResult.rows[0].total,
      page,
      limit,
    },
  };
}

/**
 * Retrieve a single student row by ID.
 */
async function getStudentById(studentId) {
  const query = `
    SELECT id, name, email, age, course
    FROM students
    WHERE id = $1
  `;

  const result = await getPool().query(query, [studentId]);
  return result.rows[0] || null;
}

/**
 * Update an existing student row.
 */
async function updateStudent(studentId, studentData) {
  const normalizedEmail = studentData.email.trim().toLowerCase();

  const emailExistsResult = await getPool().query(
    "SELECT 1 FROM students WHERE email = $1 AND id <> $2 LIMIT 1",
    [normalizedEmail, studentId]
  );

  if (emailExistsResult.rowCount > 0) {
    throw createDuplicateEmailError();
  }

  const query = `
    UPDATE students
    SET name = $1, email = $2, age = $3, course = $4
    WHERE id = $5
    RETURNING id, name, email, age, course
  `;

  const values = [
    studentData.name.trim(),
    normalizedEmail,
    Number(studentData.age),
    studentData.course.trim(),
    studentId,
  ];

  const result = await getPool().query(query, values);
  return result.rows[0] || null;
}

/**
 * Delete a student row by ID and return the deleted record.
 */
async function deleteStudent(studentId) {
  const query = `
    DELETE FROM students
    WHERE id = $1
    RETURNING id, name, email, age, course
  `;

  const result = await getPool().query(query, [studentId]);
  return result.rows[0] || null;
}

export {
  initialize,
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
