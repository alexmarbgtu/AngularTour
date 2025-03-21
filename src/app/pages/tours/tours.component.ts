import { Component, OnInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { ITour } from '../../models/tours';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-tours',
  imports: [CardModule],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
})
export class ToursComponent implements OnInit {

  tours: ITour[] = []

  constructor(private toursService: ToursService) {}

  ngOnInit(): void {
    this.toursService.getTours().subscribe(
      (data) => {
        if (Array.isArray(data?.tours)) {
          this.tours = data.tours
        }
      },
      (err) => { console.log('Error: ', err) }
    )
  }
}
