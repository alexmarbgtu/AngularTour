import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { ITour, TourType } from '../../models/tours';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { HightBlockDirective } from '../../shared/directives/hight-block.directive';
import { Subscription } from 'rxjs';
import { isValid } from 'date-fns'

@Component({
  selector: 'app-tours',
  imports: [
    CardModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    InputTextModule,
    SearchPipe,
    HightBlockDirective,
  ],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
})
export class ToursComponent implements OnInit, OnDestroy {
  tours: ITour[] = [];
  toursStore: ITour[] = [];
  subscriptionType: Subscription;
  subscriptionDate: Subscription;
  tourDate: number | null = null;
  tourType: TourType = null;

  constructor(
    private toursService: ToursService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptionType = this.toursService.tourType$.subscribe((type) => {
      this.tourType = type;
      this.filterToursByTypeAndDate();
    });

    this.subscriptionDate = this.toursService.tourDate$.subscribe((date) => {
      if (date) {
        this.tourDate = new Date(date).setHours(0, 0, 0);
      } else {
        this.tourDate = null;
      }
      this.filterToursByTypeAndDate();
    });

    this.toursService.getTours().subscribe(
      (data) => {
        if (Array.isArray(data?.tours)) {
          this.tours = data.tours;
          this.toursStore = [...data.tours];
        }
      },
      (err) => {
        console.log('Error: ', err);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptionType.unsubscribe();
    this.subscriptionDate.unsubscribe();
  }

  goToTour(id: string) {
    console.log(id);

    this.router.navigate([id], { relativeTo: this.route });
  }

  searchTours(ev: Event) {
    // TODO не используется, переделали на pipe
    const target = ev.target as HTMLInputElement;
    this.tours = this.toursService.searchTours(this.toursStore, target.value);
  }

  selectIndex(index: number): void {
    const targetTour = this.tours.find((e, i) => i === index);
    if (targetTour) {
      this.goToTour(targetTour.id);
    }
  }

  filterToursByTypeAndDate(): void {
    let filterToursArr: ITour[] = [];
    if (this.tourType) {
      switch (this.tourType.key) {
        case 'single':
          filterToursArr = this.toursStore.filter(
            (tour) => tour.type === 'single'
          );
          break;

        case 'group':
          filterToursArr = this.toursStore.filter(
            (tour) => tour.type === 'group'
          );
          break;

        case 'all':
        default:
          filterToursArr = [...this.toursStore];
          break;
      }
    } else {
      filterToursArr = [...this.toursStore];
    }

    if (this.tourDate) {
      this.tours = filterToursArr.filter((tour) => {
        if (isValid(new Date(tour.date))) {
          return this.tourDate === new Date(tour.date).setHours(0, 0, 0, 0);
        } else {
          return false;
        }
      });
    } else {
      this.tours = [...filterToursArr];
    }
  }
}
