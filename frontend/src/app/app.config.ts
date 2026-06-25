/**
 * Application Configuration
 * Configures Angular providers for the standalone application:
 * - Zone change detection with event coalescing for performance
 * - Router for client-side navigation
 * - HTTP client for API communication with backend
 */
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enable event coalescing for better change detection performance
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Provide router with defined routes
    provideRouter(routes),
    // Enable HTTP client for API calls
    provideHttpClient(),
  ]
};
