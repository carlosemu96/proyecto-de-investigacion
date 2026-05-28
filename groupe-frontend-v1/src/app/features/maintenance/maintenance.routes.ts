import { Routes } from '@angular/router';

/** Lazy-loaded routes for the Maintenance feature */
export const MAINTENANCE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/maintenance-list.component').then(m => m.MaintenanceListComponent)
  }
];
