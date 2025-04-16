import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { authInterceptor, loggingInterceptor } from './shared/Intercepting/authorization';
import { errorInterceptor } from './shared/Intercepting/error.interceptor';
import { MessageService } from 'primeng/api';

function initializeApp(config: ConfigService) {
  return config.loadPromise()
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
      translation: {
        dayNames: [
          'Воскресенье',
          'Понедельник',
          'Вторник',
          'Среда',
          'Четверг',
          'Пятница',
          'Суббота',
        ],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: [
          'Январь',
          'Февраль',
          'Март',
          'Апрель',
          'Май',
          'Июнь',
          'Июль',
          'Август',
          'Сентябрь',
          'Октябрь',
          'Ноябрь',
          'Декабрь',
        ],
        monthNamesShort: [
          'янв',
          'фев',
          'мар',
          'апр',
          'мая',
          'июня',
          'июля',
          'авг',
          'сен',
          'окт',
          'ноя',
          'дек',
        ],
        firstDayOfWeek: 1,
        // dateFormat: 'dd.mm.yy',
        clear: 'Очистить',
        today: 'Сегодня',
        //translations
      },
    }),
    provideHttpClient(withInterceptors([authInterceptor, loggingInterceptor, errorInterceptor])),
    // provideHttpClient(),
    provideAppInitializer(() => initializeApp(inject(ConfigService))),
    MessageService
  ],
};
