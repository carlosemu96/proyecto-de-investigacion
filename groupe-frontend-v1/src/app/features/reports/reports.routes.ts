import { Routes } from '@angular/router';

/** Lazy-loaded routes for the Reports feature */
export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/reports.component').then(m => m.ReportsComponent)
  }
];
