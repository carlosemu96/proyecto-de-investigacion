import { Routes } from '@angular/router';

/** Lazy-loaded routes for the Vehicles feature */
export const VEHICLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/vehicle-list.component').then(m => m.VehicleListComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/vehicle-detail.component').then(m => m.VehicleDetailComponent)
  }
];
