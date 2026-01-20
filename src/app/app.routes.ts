import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component')
        .then(m => m.HomeComponent)
  },
  {
    path: 'aktiviteter',
    loadComponent: () =>
      import('./features/activities/activities.component')
        .then(m => m.ActivitiesComponent)
  },
  {
    path: 'medlemmer',
    loadComponent: () =>
      import('./features/members/members.component')
        .then(m => m.MembersComponent)
  },
  {
    path: 'om-os',
    loadComponent: () =>
      import('./features/about/about.component')
        .then(m => m.AboutComponent)
  },
  {
    path: 'kontakt',
    loadComponent: () =>
      import('./features/contact/contact.component')
        .then(m => m.ContactComponent)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
  { path: '**', redirectTo: '' }
];