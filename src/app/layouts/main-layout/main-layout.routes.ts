import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // ── Core ────────────────────────────────────────────────────────────
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../../features/dashboard/pages/dashboard.component').then(m => m.DashboardComponent)
      },

      // ── Fleet management (new) ──────────────────────────────────────────
      {
        path: 'vehicles',
        loadChildren: () =>
          import('../../features/vehicles/vehicles.routes').then(m => m.VEHICLES_ROUTES)
      },
      {
        path: 'maintenance',
        loadChildren: () =>
          import('../../features/maintenance/maintenance.routes').then(m => m.MAINTENANCE_ROUTES)
      },
      {
        path: 'spare-parts',
        loadChildren: () =>
          import('../../features/spare-parts/spare-parts.routes').then(m => m.SPARE_PARTS_ROUTES)
      },

      // ── Monitoring (new) ────────────────────────────────────────────────
      {
        path: 'alerts',
        loadChildren: () =>
          import('../../features/alerts/alerts.routes').then(m => m.ALERTS_ROUTES)
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('../../features/analytics/analytics.routes').then(m => m.ANALYTICS_ROUTES)
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../../features/reports/reports.routes').then(m => m.REPORTS_ROUTES)
      },

      // ── Admin / UI (existing — preserved) ──────────────────────────────
      {
        path: 'users',
        loadComponent: () =>
          import('../../features/user/pages/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'forms',
        loadComponent: () =>
          import('../../features/admin/pages/form-demo.component').then(m => m.FormDemoComponent)
      },
      {
        path: 'ui',
        loadComponent: () =>
          import('../../features/admin/pages/ui-demo.component').then(m => m.UiDemoComponent)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../../features/settings/pages/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../../features/profile/pages/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'blank',
        loadComponent: () =>
          import('../../features/admin/pages/blank.component').then(m => m.BlankComponent)
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
]; 