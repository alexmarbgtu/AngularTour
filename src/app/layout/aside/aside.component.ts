import { Component, inject, OnInit } from '@angular/core';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { ToursService } from '../../services/tours.service';
import { FormsModule } from '@angular/forms';
import { ITourType } from '../../models/tours';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-aside',
  imports: [
    SelectModule,
    FormsModule,
    DatePickerModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
})
export class AsideComponent implements OnInit {
  private tourService = inject(ToursService);

  date: Date = null;
  selectedType: ITourType = null;

  tourTypes: ITourType[] = [
    { key: 'single', label: 'Одиночный' },
    { key: 'group', label: 'Групповой' },
    { key: 'all', label: 'Все' },
  ];

  isBasketTour: boolean = false;

  ngOnInit(): void {
    const typeTour = this.tourService.getTypeSearchTours;
    const typeTourKey = typeTour ? typeTour.key : 'all';
    this.selectedType = this.tourTypes.find((type) => type.key === typeTourKey);

    const dateTour = this.tourService.getDateSearchTours;
    if (dateTour) this.date = dateTour;
  }

  changeTourType(ev: SelectChangeEvent): void {
    this.tourService.initChangeTourType(this.selectedType);
  }

  changeDate(date: Date | null): void {
    this.tourService.initChangeTourDate(date);
  }

  clearFilter(): void {
    this.selectedType = this.tourTypes.find((type) => type.key === 'all');
    this.date = null;
    this.tourService.initChangeTourType(this.selectedType);
    this.tourService.initChangeTourDate(this.date);
  }
  showBasketTours(): void {
    this.tourService.initChangeTourShowInBasket(this.isBasketTour)
  }
}
