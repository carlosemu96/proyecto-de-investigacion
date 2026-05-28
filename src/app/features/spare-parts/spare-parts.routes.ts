import { Routes } from '@angular/router';

/** Lazy-loaded routes for the Spare Parts feature */
export const SPARE_PARTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/parts-list.component').then(m => m.PartsListComponent)
  }
];
