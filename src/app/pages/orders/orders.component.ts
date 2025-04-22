import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../models/order';
import { ToursService } from '../../services/tours.service';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-orders',
  imports: [TableModule, AsyncPipe, ButtonModule, ConfirmDialog],
  providers: [ConfirmationService],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  orders: Observable<IOrder[]>;

  constructor(
    private toursService: ToursService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.orders = this.toursService.getOrders();
  }

  removeItemToOrder(ev: Event, order: IOrder) {
    ev.stopPropagation();

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Заказ с ID тура "${order.tourId}" будет удалён`,
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
        this.messageService.add({ severity: 'info', detail: 'Заказ удалён' });
      },
    });
  }
}
