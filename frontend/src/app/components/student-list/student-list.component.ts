/**
 * Student List Component
 * Displays all students in a table with options to create, edit, or delete.
 * Handles data loading, error states, and navigation to form component.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StudentService, Student } from '../../services/student.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
})
export class StudentListComponent implements OnInit {
  /** Array of student records to display */
  students: Student[] = [];
  /** Current page number (1-based) */
  currentPage = 1;
  /** Number of records per page */
  pageSize = 5;
  /** Total records available in backend */
  totalRecords = 0;
  /** Search term typed by user */
  searchTerm = '';
  /** Search term currently applied to API request */
  appliedSearchTerm = '';
  /** Flag to show loading spinner during API calls */
  loading = false;
  /** Error message if API call fails */
  error: string | null = null;

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook.
   * Loads student list when component initializes.
   */
  ngOnInit(): void {
    this.loadStudents();
  }

  /**
   * Fetch all students from backend API.
   * Updates students array, loading state, and error state.
   */
  loadStudents(): void {
    this.loading = true;
    this.error = null;
    this.studentService
      .getAllStudents(this.currentPage, this.pageSize, this.appliedSearchTerm || undefined)
      .subscribe({
      next: (response: any) => {
        // Extract students from paginated response
        this.students = response.data.students;
        this.totalRecords = response.data.pagination.total;
        this.currentPage = response.data.pagination.page;
        this.pageSize = response.data.pagination.limit;
        this.loading = false;
      },
      error: (err: any) => {
        // Display error message to user
        this.error = 'Failed to load students: ' + err.message;
        this.loading = false;
      },
      });
  }

  /**
   * Delete a student with confirmation.
   * Reloads student list after successful deletion.
   * @param id - Student ID to delete
   */
  deleteStudent(id: number | undefined): void {
    // Prevent deletion if no ID or user cancels confirmation
    if (!id || !confirm('Are you sure you want to delete this student?')) {
      return;
    }

    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        // If last item on a page is deleted, move to previous page when possible.
        if (this.students.length === 1 && this.currentPage > 1) {
          this.currentPage -= 1;
        }
        // Refresh list after successful deletion
        this.loadStudents();
      },
      error: (err: any) => {
        // Display error if deletion fails
        this.error = 'Failed to delete student: ' + err.message;
      },
    });
  }

  /**
   * Navigate to edit form for the selected student.
   * @param id - Student ID to edit
   */
  editStudent(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/edit', id]);
    }
  }

  /**
   * Navigate to create form for new student.
   */
  createStudent(): void {
    this.router.navigate(['/create']);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  goToPreviousPage(): void {
    if (!this.hasPreviousPage || this.loading) {
      return;
    }

    this.currentPage -= 1;
    this.loadStudents();
  }

  goToNextPage(): void {
    if (!this.hasNextPage || this.loading) {
      return;
    }

    this.currentPage += 1;
    this.loadStudents();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = Number(pageSize);
    this.currentPage = 1;
    this.loadStudents();
  }

  applySearch(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
    this.currentPage = 1;
    this.loadStudents();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.currentPage = 1;
    this.loadStudents();
  }
}
