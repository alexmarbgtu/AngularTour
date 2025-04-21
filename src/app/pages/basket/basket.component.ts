import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BasketService } from '../../services/Basket.service';
import { ITour } from '../../models/tours';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-basket',
  imports: [
    TableModule,
    AsyncPipe,
    DatePipe,
    ButtonModule,
    DecimalPipe,
    ConfirmDialog,
  ],
  providers: [ConfirmationService],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent {
  basketItems = inject(BasketService).basketStore$;
  basketService = inject(BasketService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  removeItemToBasket(ev: Event, tour: ITour): void {
    ev.stopPropagation();
    console.log('removeItemToBasket');

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Из корзины будет удалён тур "${tour.name}"?`,
      header: 'Удаление тура из корзины',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Отмена',
      rejectButtonProps: {
        label: 'Отмена',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Удалить',
        severity: 'danger',
      },

      accept: () => {
        this.basketService.removeItemToBasket(tour);
        this.messageService.add({ severity: 'info', detail: 'Тур удалён' });
      },
    });
  }
}
