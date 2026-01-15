import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ActivitiesComponent } from './features/activities/activities.component';
import { MembersComponent } from './features/members/members.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'aktiviteter', component: ActivitiesComponent },
  { path: 'medlemmer', component: MembersComponent },
  { path: 'om-os', component: AboutComponent },
  { path: 'kontakt', component: ContactComponent },
  { path: '**', redirectTo: '' }
];