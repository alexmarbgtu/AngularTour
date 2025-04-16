import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { LayoutComponent } from './layout/layout.component';
import { ToursComponent } from './pages/tours/tours.component';
import { TourItemComponent } from './pages/tour-item/tour-item.component';
import { authGuard } from './shared/guards/auth.guard';
import { SettingsComponent } from './pages/settings/settings.component';
import { ChangePasswordComponent } from './pages/settings/change-password/change-password.component';
import { StatisticsComponent } from './pages/settings/statistics/statistics.component';
import { OrderComponent } from './pages/order/order.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent, title: 'Авторизация' },
  { path: '', redirectTo: '/auth', pathMatch: 'full' }, // redirect to `auth`
  {
    path: 'tours',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ToursComponent,
        title: 'Туры',
        data: { showAside: true },
      },
      {
        path: 'tour',
        component: ToursComponent,
        pathMatch: 'full',
        title: 'Туры',
      },
      { path: ':id', component: TourItemComponent, title: 'Тур' },
    ],
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: SettingsComponent,
        title: 'Настройки',
        children: [
          { path: '', redirectTo: 'change-password', pathMatch: 'full' },
          {
            path: 'change-password',
            component: ChangePasswordComponent,
            title: 'Смена пароля',
          },
          {
            path: 'statistics',
            component: StatisticsComponent,
            title: 'Статистика',
            data: { showAside: true },
          },
        ],
      },
    ],
  },
  {
    path: 'order',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/tours', pathMatch: 'full' },
      {
        path: ':id',
        component: OrderComponent,
        title: 'Заказ',
      },
    ],
  },

  { path: '**', redirectTo: '/auth', pathMatch: 'full' }, // Wildcard route for a 404 page
];
