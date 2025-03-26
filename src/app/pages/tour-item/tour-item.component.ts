import { Component, OnInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { ActivatedRoute } from '@angular/router';
import { ITour } from '../../models/tours';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-tour-item',
  imports: [CardModule],
  templateUrl: './tour-item.component.html',
  styleUrl: './tour-item.component.scss',
})
export class TourItemComponent implements OnInit {
  tourId: string = null;
  tour: ITour;
  // = {
  //   id: '',
  //   name: '',
  //   description: '',
  //   tourOperator: '',
  //   price: '',
  //   img: '',
  //   type: '',
  // };

  constructor(
    private toursService: ToursService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tourId = this.route.snapshot.paramMap.get('id');
    this.toursService.getTourById(this.tourId).subscribe(
      (data) => {
        if (data?.name) {
          this.tour = data;
        }
      },
      (err) => {
        console.log('Error: ', err);
      }
    );
  }
}
