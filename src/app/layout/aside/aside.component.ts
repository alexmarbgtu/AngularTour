import { Component, inject, OnInit } from '@angular/core';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { ToursService } from '../../services/tours.service';
import { FormsModule } from '@angular/forms';
import { ITourType } from '../../models/tours';
import { DatePickerModule } from 'primeng/datepicker';
import { isValid } from 'date-fns';

@Component({
  selector: 'app-aside',
  imports: [SelectModule, FormsModule, DatePickerModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
})

export class AsideComponent implements OnInit {
  private tourService = inject(ToursService);


  date: Date = null;
  selectedType: ITourType = null;

  tourTypes: ITourType[] = [
    {key: 'single', label: 'Одиночный'},
    {key: 'group', label: 'Групповой'},
    {key: 'all', label: 'Все'}
  ];

  ngOnInit(): void {
    this.selectedType = this.tourTypes.find((type) => type.key === 'all')
  }

  changeTourType(ev: SelectChangeEvent): void {
    this.tourService.initChangeTourType(this.selectedType)
  }

  changeDate(date: Date | null): void {
    this.tourService.initChangeTourDate(date);
  }

}
