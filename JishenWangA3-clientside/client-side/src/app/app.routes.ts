import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'register/:id', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];