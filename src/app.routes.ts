import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { MembersComponent } from './pages/members/members.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'aktiviteter', component: ActivitiesComponent },
  { path: 'medlemmer', component: MembersComponent },
  { path: 'om-os', component: AboutComponent },
  { path: 'kontakt', component: ContactComponent },
  { path: '**', redirectTo: '' }
];