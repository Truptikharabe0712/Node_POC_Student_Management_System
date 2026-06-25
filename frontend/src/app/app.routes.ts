/**
 * Application Routes
 * Defines all client-side routes for the SPA:
 * - '': Student list view (StudentListComponent)
 * - 'create': Create new student form (StudentFormComponent)
 * - 'edit/:id': Edit existing student form (StudentFormComponent with dynamic ID)
 */
import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';

export const routes: Routes = [
  // Default route: display student list
  { path: '', component: StudentListComponent },
  // Route to create a new student (form in new-mode)
  { path: 'create', component: StudentFormComponent },
  // Route to edit an existing student (form in edit-mode with dynamic student ID)
  { path: 'edit/:id', component: StudentFormComponent },
];
