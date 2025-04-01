import { Component, EventEmitter, inject, Input, model, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ITour } from '../../../models/tours';
import { ToursService } from '../../../services/tours.service';
import { GalleriaModule } from 'primeng/galleria';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-nearest-tours',
  imports: [GalleriaModule, NgOptimizedImage],
  templateUrl: './nearest-tours.component.html',
  styleUrl: './nearest-tours.component.scss',
})
export class NearestToursComponent implements OnInit, OnChanges {
  @Input() tour: ITour = null;
  @Output() onTourChange = new EventEmitter<ITour>()

  tourService = inject(ToursService);
  toursArr = model<ITour[]>([]);
  activeLocationId : string

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const tour = changes['tour']?.currentValue as ITour;

    if (tour?.locationId && this.activeLocationId !== tour.locationId) {
      this.activeLocationId = tour.locationId
      this.tourService
        .getNearestTourByLocationId(tour.locationId)
        .subscribe((data) => {
          this.toursArr.set(data);
        });
    }
  }

  activeIndexChange(index: number) {
    const activeTour = this.toursArr().find((el,i) => i === index)
    this.onTourChange.emit(activeTour)

  }
}
