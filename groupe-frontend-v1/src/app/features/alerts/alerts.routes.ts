import { Routes } from '@angular/router';

/** Lazy-loaded routes for the Alerts feature */
export const ALERTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/alert-list.component').then(m => m.AlertListComponent)
  }
];
