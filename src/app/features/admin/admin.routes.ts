import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

/**
 * Admin Routes
 * 
 * Structure:
 * /admin/login - Login page (unprotected)
 * /admin - Admin Layout (shell, protected)
 *   ├─ /admin/activities - Activities CRUD (protected)
 *   └─ /admin/activity-types - Activity Types CRUD (protected)
 */
export const adminRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'activities',
        pathMatch: 'full'
      },
      {
        path: 'activities',
        loadComponent: () =>
          import('./activities/admin-activities.page').then(m => m.AdminActivitiesPage)
      },
      {
        path: 'activity-types',
        loadComponent: () =>
          import('./activity-types/admin-types.page').then(m => m.AdminTypesPage)
      }
    ]
  }
];
