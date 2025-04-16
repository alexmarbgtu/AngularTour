import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BasketService } from '../../services/Basket.service';
import { ITour } from '../../models/tours';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-basket',
  imports: [TableModule, AsyncPipe, DatePipe, ButtonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent {
  basketItems = inject(BasketService).basketStore$;
  basketService = inject(BasketService);

  removeItemToBasket(ev: Event, tour: ITour): void {
    this.basketService.removeItemToBasket(tour);
  }
}
