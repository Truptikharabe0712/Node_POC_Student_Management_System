/**
 * Student Service Layer
 * Acts as an intermediary between controllers and data repositories.
 * Delegates all CRUD operations to the active repository (JSON or PostgreSQL).
 * This abstraction allows data storage to be switched without changing controller code.
 */
import { getStudentRepository } from "../data/studentRepositoryFactory.js";

/**
 * Get the currently active repository (determined by STORAGE_MODE).
 */
function getRepository() {
  return getStudentRepository();
}

/**
 * Create a new student. Delegates to repository's create method.
 * Repository enforces email uniqueness and returns HTTP 409 on conflict.
 */
async function createStudent(studentData) {
  return getRepository().createStudent(studentData);
}

/**
 * Retrieve all students with optional filters (name search, pagination).
 * Delegates to repository's getAllStudents method.
 */
async function getAllStudents(filters) {
  return getRepository().getAllStudents(filters);
}

/**
 * Retrieve a single student by ID.
 * Returns null if student not found.
 */
async function getStudentById(studentId) {
  return getRepository().getStudentById(studentId);
}

/**
 * Update an existing student record.
 * Repository enforces email uniqueness on update.
 * Returns null if student not found.
 */
async function updateStudent(studentId, studentData) {
  return getRepository().updateStudent(studentId, studentData);
}

/**
 * Delete a student record by ID.
 * Returns null if student not found.
 */
async function deleteStudent(studentId) {
  return getRepository().deleteStudent(studentId);
}

export {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};

//Input code 
// 'use strict';
// class Computer {
//   display() {
//     console.log("Displaying computer information.");
//   }
// }
// class Storage extends Computer {
//   display() {
//     console.log("Displaying storage information.");
//   }
// }
// var obj = new Storage();
// obj.display();

//output =>Displaying storage information. 

// Boolean.prototype.state = function() {
//   if(this.valueOf() == false) {
//     return "Toggle"
// }
// else {
//   return "fixed";
// }
// };

// function show(){
//   var my_state = new Boolean(false);
//   console.log(my_state.state());
// }
// show(); // Output: Toggle


// let x= true;
// if(true){
//   console.log("x");
//   let x;
//   console.log(x);
//   x = 123;
//   console.log(x);
// }
// console.log(x);

// class A{
//   display(){
//     console.log("A");
//   }
// }
// class B extends A{
//   display(){
//     console.log("B");
//   }
// }
// var obj = new B();
// obj.display(); // Output: B

// try{
//   const names = await.speakerService.getNames();
//   res.local.speakerService = names;
//   return next();
// }catch(err){
//  return next(err);
// }