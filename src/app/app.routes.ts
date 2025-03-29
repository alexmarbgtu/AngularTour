import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { LayoutComponent } from './layout/layout.component';
import { ToursComponent } from './pages/tours/tours.component';
import { TourItemComponent } from './pages/tour-item/tour-item.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent, title: 'Авторизация' },
  { path: '', redirectTo: '/auth', pathMatch: 'full' }, // redirect to `auth`
  { path: 'tours',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      { path: '', component: ToursComponent, title: 'Туры' },
      { path: 'tour', component: ToursComponent, pathMatch: 'full', title: 'Туры' },
      { path: ':id', component: TourItemComponent, title: 'Тур' }
    ],
  },

  { path: '**', redirectTo: '/auth', pathMatch: 'full' }, // Wildcard route for a 404 page
];
