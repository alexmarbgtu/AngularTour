import { Component, inject, Input, model, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ITour } from '../../../models/tours';
import { ToursService } from '../../../services/tours.service';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-nearest-tours',
  imports: [GalleriaModule],
  templateUrl: './nearest-tours.component.html',
  styleUrl: './nearest-tours.component.scss',
})
export class NearestToursComponent implements OnInit, OnChanges {
  @Input() tour: ITour = null;

  tourService = inject(ToursService);
  toursArr = model<ITour[]>([]);

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const tour = changes['tour']?.currentValue as ITour;

    if (tour?.locationId) {
      this.tourService
        .getNearestTourByLocationId(tour.locationId)
        .subscribe((data) => {
          this.toursArr.set(data)
        }
        );
    }
  }
}
