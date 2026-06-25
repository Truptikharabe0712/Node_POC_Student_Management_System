/**
 * Root Application Component
 * Serves as the main container for the entire SPA.
 * Uses RouterOutlet to render the appropriate component based on the current route.
 */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
