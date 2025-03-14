import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent, title: 'Авторизация' },
  { path: '', redirectTo: '/auth', pathMatch: 'full' }, // redirect to `auth`
  { path: '**', redirectTo: '/auth', pathMatch: 'full' }, // Wildcard route for a 404 page
];
