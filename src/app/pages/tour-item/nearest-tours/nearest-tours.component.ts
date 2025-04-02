import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, model, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ITour } from '../../../models/tours';
import { ToursService } from '../../../services/tours.service';
import { GalleriaModule } from 'primeng/galleria';
import { NgOptimizedImage } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-nearest-tours',
  imports: [
    GalleriaModule,
    NgOptimizedImage,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './nearest-tours.component.html',
  styleUrl: './nearest-tours.component.scss',
})
export class NearestToursComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() tour: ITour = null;
  @Output() onTourChange = new EventEmitter<ITour>();
  @ViewChild('searchInput') searchInput: ElementRef;

  tourService = inject(ToursService);
  toursArr = model<ITour[]>([]);
  toursArrCopy = model<ITour[]>([]);
  activeLocationId: string;
  activeTour: ITour = null;
  activeIndex: number = 0

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const tour = changes['tour']?.currentValue as ITour;

    if (tour?.locationId && this.activeLocationId !== tour.locationId) {
      this.activeLocationId = tour.locationId;
      this.tourService
        .getNearestTourByLocationId(tour.locationId)
        .subscribe((data) => {
          this.toursArr.set(data);
          this.toursArrCopy.set(data);
          this.activeTour = data[0]
        });
    }
  }

  ngAfterViewInit(): void {
    fromEvent<InputEvent>(this.searchInput.nativeElement, 'input').subscribe(
      (ev: Event) => {
        const inputTargetValue = (ev.target as HTMLInputElement).value;
        if (inputTargetValue === '') {
          this.toursArr.set(this.toursArrCopy());
        } else {
          const newToursArr = this.tourService.searchTours(
            this.toursArrCopy(),
            inputTargetValue
          );
          this.toursArr.set(newToursArr);
          this.activeIndex = 0;
          this.activeTour = newToursArr[0];
        }
      }
    );
  }

  activeIndexChange(index: number) {
    this.activeIndex = index
    this.activeTour = this.toursArr().find((el, i) => i === index);
  }

  clickImgNearest(ev: Event) {
    if (this.activeTour) {
      this.onTourChange.emit(this.activeTour);
    }
  }
}
