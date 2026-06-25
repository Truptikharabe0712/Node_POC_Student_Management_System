/**
 * Student Form Component
 * Handles both create and edit modes for student records.
 * Detects mode via route params, loads existing data in edit mode,
 * and submits create or update requests to the backend.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService, Student } from '../../services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss',
})
export class StudentFormComponent implements OnInit {
  /** Student data model bound to form inputs */
  student: Student = {
    name: '',
    email: '',
    age: 0,
    course: '',
  };

  /** True if editing existing student, false if creating new */
  isEditMode = false;
  /** Flag to show loading state during API calls */
  loading = false;
  /** General error message for failed operations */
  error: string | null = null;
  /** Success message after successful form submission */
  success: string | null = null;
  /** Field-level validation errors from backend (e.g., { 'email': 'Email already exists' }) */
  validationErrors: { [key: string]: string } = {};

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook.
   * Checks if editing (has route param 'id') or creating new student.
   * If editing, loads existing student data.
   */
  ngOnInit(): void {
    // Extract student ID from URL params (e.g., /edit/5)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadStudent(Number(id));
    }
  }

  /**
   * Load existing student data for edit mode.
   * Populates form with student details from backend.
   * @param id - Student ID to load
   */
  loadStudent(id: number): void {
    this.loading = true;
    this.studentService.getStudentById(id).subscribe({
      next: (response: any) => {
        // Populate form with existing student data
        this.student = response.data;
        this.loading = false;
      },
      error: (err: any) => {
        // Display error if student not found
        this.error = 'Failed to load student: ' + err.message;
        this.loading = false;
      },
    });
  }

  /**
   * Submit form to create or update student.
   * Handles both POST (create) and PUT (update) requests.
   * Displays field-level validation errors from backend.
   */
  submitForm(): void {
    // Clear previous error/success states and validation errors
    this.validationErrors = {};
    this.error = null;
    this.success = null;
    this.loading = true;

    // Choose operation based on mode
    const saveOperation = this.isEditMode
      ? this.studentService.updateStudent(this.student.id!, this.student)
      : this.studentService.createStudent(this.student);

    saveOperation.subscribe({
      next: (response: any) => {
        // Show success message and navigate back after 1.5 seconds
        this.loading = false;
        this.success = response.message;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err: any) => {
        this.loading = false;
        if (err.status === 400 && err.error.errors) {
          // Backend returns field-wise validation errors; map them for inline display.
          err.error.errors.forEach(
            (errorItem: { field: string; message: string }) => {
              this.validationErrors[errorItem.field] = errorItem.message;
            }
          );
        } else {
          // Display general error message
          this.error = err.error?.message || 'An error occurred';
        }
      },
    });
  }

  /**
   * Cancel form submission and navigate back to list.
   */
  cancel(): void {
    this.router.navigate(['/']);
  }
}
