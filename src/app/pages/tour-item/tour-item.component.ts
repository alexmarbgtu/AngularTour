import { Component, OnInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ITour } from '../../models/tours';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { NearestToursComponent } from './nearest-tours/nearest-tours.component';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { isValid } from 'date-fns'

@Component({
  selector: 'app-tour-item',
  imports: [
    CardModule,
    ButtonModule,
    RouterLink,
    NearestToursComponent,
    DatePipe

  ],
  templateUrl: './tour-item.component.html',
  styleUrl: './tour-item.component.scss',
})
export class TourItemComponent implements OnInit {
  tourId: string = null;
  tour: ITour;
  tourDate: Date = null

  constructor(
    private toursService: ToursService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.tourId = this.route.snapshot.paramMap.get('id');
    this.toursService.getTourById(this.tourId).subscribe(
      (data) => {
        if (data?.name) {
          this.tour = data;
          if (isValid(new Date(this.tour.date)))
            this.tourDate = new Date(this.tour.date);
        }
      },
      (err) => {
        console.log('Error: ', err);
      }
    );
  }

  onTourChange(ev: ITour): void {
    this.tour = ev;
    this.location.replaceState('tours/' + this.tour.id);
  }

  initOrder(ev: Event): void {
    this.router.navigate(['/order', this.tour.id])
  }

}
