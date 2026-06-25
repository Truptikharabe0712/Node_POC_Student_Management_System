/**
 * Student HTTP Service
 * Provides methods for all CRUD operations against the backend REST API.
 * Handles API communication via HttpClient and returns Observable responses.
 * Base URL: http://localhost:5000/students
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Student data model.
 */
export interface Student {
  id?: number;
  name: string;
  email: string;
  age: number;
  course: string;
}

/**
 * Generic API response wrapper.
 * All backend responses follow this structure with success flag and message.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Student list response data structure.
 * Includes pagination metadata with the student array.
 */
export interface StudentListData {
  students: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  // Backend API base URL for student endpoints
  private readonly baseUrl = 'http://localhost:5000/students';

  constructor(private http: HttpClient) {}

  /**
   * Get all students with optional search, page, and limit parameters.
   * @param page - Page number (default 1)
   * @param limit - Records per page (default 5)
   * @param name - Optional student name search filter
   */
  getAllStudents(
    page: number = 1,
    limit: number = 5,
    name?: string
  ): Observable<ApiResponse<StudentListData>> {
    let url = `${this.baseUrl}?page=${page}&limit=${limit}`;
    if (name) {
      url += `&name=${encodeURIComponent(name)}`;
    }
    return this.http.get<ApiResponse<StudentListData>>(url);
  }

  /**
   * Retrieve a single student by ID.
   * @param id - Student ID
   */
  getStudentById(id: number): Observable<ApiResponse<Student>> {
    return this.http.get<ApiResponse<Student>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new student record.
   * @param student - Student data (without ID)
   */
  createStudent(student: Student): Observable<ApiResponse<Student>> {
    return this.http.post<ApiResponse<Student>>(this.baseUrl, student);
  }

  /**
   * Update an existing student record.
   * @param id - Student ID to update
   * @param student - Updated student data
   */
  updateStudent(id: number, student: Student): Observable<ApiResponse<Student>> {
    return this.http.put<ApiResponse<Student>>(`${this.baseUrl}/${id}`, student);
  }

  /**
   * Delete a student record.
   * @param id - Student ID to delete
   */
  deleteStudent(id: number): Observable<ApiResponse<Student>> {
    return this.http.delete<ApiResponse<Student>>(`${this.baseUrl}/${id}`);
  }
}
