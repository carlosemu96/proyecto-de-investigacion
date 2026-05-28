import { Routes } from '@angular/router';

/** Lazy-loaded routes for the Analytics feature */
export const ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/analytics.component').then(m => m.AnalyticsComponent)
  }
];
