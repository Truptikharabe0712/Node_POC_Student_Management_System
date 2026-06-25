import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the directory of the current module in ES modules environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON file that persists the student data
const dataFile = path.resolve(__dirname, "../../data/students.json");

// In-memory student list and next available ID counter
const students = [];
let nextStudentId = 1;

// Persist the in-memory student state to disk
async function saveStudents() {
  try {
    const data = {
      students,
      nextStudentId,
    };

    // Ensure the data directory exists before writing the file
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving students:", error);
  }
}

// Load student data from disk into memory
async function loadStudents() {
  try {
    const data = await fs.readFile(dataFile, "utf-8");
    const parsed = JSON.parse(data);

    // Replace the contents of the students array without changing its reference
    students.splice(0, students.length, ...parsed.students);
    nextStudentId = parsed.nextStudentId;
    console.log("Students loaded from file");
  } catch (error) {
    // Ignore the missing file case on first run, but log other errors
    if (error.code !== "ENOENT") {
      console.error("Error loading students:", error);
    }
  }
}

// Return the current in-memory list of students
function getStudents() {
  return students;
}

// Generate and return a new unique student ID
function getNextStudentId() {
  const studentId = nextStudentId;
  nextStudentId += 1;
  return studentId;
}

export {
  getStudents,
  getNextStudentId,
  saveStudents,
  loadStudents,
};
