import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-settings',
  imports: [ButtonModule, RouterLink, RouterOutlet ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  menuItems = [
    {
      label: 'Смена пароля',
      patch: 'change-password',
    },
    {
      label: 'Статистика',
      patch: 'statistics',
    },
  ];
}
