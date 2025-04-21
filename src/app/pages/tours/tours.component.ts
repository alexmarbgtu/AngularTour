import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { ILocation, ITour, ITourType } from '../../models/tours';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { HightBlockDirective } from '../../shared/directives/hight-block.directive';
import { map, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { isValid } from 'date-fns'
import { DialogModule } from 'primeng/dialog';
import { MapComponent } from '../../shared/components/map/map.component';
import { UserService } from '../../services/user.service';

//delete tour
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { BasketService } from '../../services/Basket.service';

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
    DialogModule,
    MapComponent,
    ConfirmDialog,
  ],
  providers: [ConfirmationService,],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
})
export class ToursComponent implements OnInit, OnDestroy {
  tours: ITour[] = [];
  toursStore: ITour[] = [];
  toursStoreServer: ITour[] = [];
  tourDate: number | null = null;
  tourType: ITourType = null;
  destroyed = new Subject<boolean>();
  showModal = false;
  location: ILocation = null;
  temperature: number = null;
  weather: string = null;
  isAdmin: boolean = false;
  selectedTour: ITour = null;

  constructor(
    private toursService: ToursService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.toursService.getTours().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.toursStore = [...data];
          this.toursStoreServer = [...data];
          if (this.tourDate || this.tourType) {
            this.filterTours(this.toursStore);
          } else this.tours = data;
        }
      },
      (err) => {
        console.log('Error: ', err);
      }
    );

    this.tourType = this.toursService.getTypeSearchTours;
    const dateTour = this.toursService.getDateSearchTours;
    if (dateTour) {
      this.tourDate = new Date(dateTour).setHours(0, 0, 0);
    }

    this.toursService.tourType$
      .pipe(takeUntil(this.destroyed))
      .subscribe((type) => {
        this.tourType = type;
        this.filterTours(this.toursStore);
      });

    this.toursService.tourDate$
      .pipe(takeUntil(this.destroyed))
      .subscribe((date) => {
        if (date) {
          this.tourDate = new Date(date).setHours(0, 0, 0);
        } else {
          this.tourDate = null;
        }
        this.filterTours(this.toursStore);
      });

    this.toursService.toursInBasket$
      .pipe(
        withLatestFrom(
          this.basketService.basketStore$
        ),
        map(([inBasket, basketStore]) => {
          if (inBasket) return basketStore;
          else return this.toursStoreServer;
        })
      )
      .subscribe((data) => {
        this.toursStore = [...data];
        this.filterTours(this.toursStore);
      });

    this.basketService.basketStore$
      .pipe(
        withLatestFrom(this.toursService.toursInBasket$),
        map(([basketStore, inBasket]) => {
          if (inBasket) return basketStore;
          else return this.toursStoreServer;
        })
      )
      .subscribe((data) => {
        this.toursStore = [...data];
        this.filterTours(this.toursStore);
      });

    // this.getTour();
    this.isAdmin = this.userService.getUser()?.login === 'admin';
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
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

  filterToursByType(toursArr: ITour[]): ITour[] {
    let filterToursArr: ITour[] = [];
    if (this.tourType) {
      switch (this.tourType.key) {
        case 'single':
          filterToursArr = toursArr.filter((tour) => tour.type === 'single');
          break;

        case 'group':
          filterToursArr = toursArr.filter((tour) => tour.type === 'group');
          break;

        case 'all':
        default:
          filterToursArr = [...toursArr];
          break;
      }
    } else {
      filterToursArr = [...toursArr];
    }
    return filterToursArr;
  }

  filterToursByDate(toursArr: ITour[]): ITour[] {
    if (this.tourDate) {
      return toursArr.filter((tour) => {
        if (tour.date && isValid(new Date(tour.date))) {
          return this.tourDate === new Date(tour.date).setHours(0, 0, 0, 0);
        } else {
          return false;
        }
      });
    } else {
      return [...toursArr];
    }
  }

  filterTours(toursArr: ITour[]) {
    this.tours = this.filterToursByType(
      this.filterToursByDate(this.toursStore)
    );
  };

  getCountryDetail(ev: Event, code: string, tour: ITour) {
    ev.stopPropagation();
    this.toursService.getCountryByCode(code).subscribe((data) => {
      if (data?.weatherData) {
        const weatherInfo = data.weatherData;
        this.weather = weatherInfo.weather;
        this.temperature = weatherInfo.temperature;
      }

      if (data?.countryData) {
        const countryInfo = data.countryData;
        this.location = {
          lat: countryInfo.latlng[0],
          lng: countryInfo.latlng[1],
        };
        this.selectedTour = tour;
        this.showModal = true;
      }
    });
  }

  deleteTourDialog(event: Event, tour: ITour): void {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Будет удалён тур "${tour.name}"?`,
      header: 'Удаление тура',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Отмена',
      rejectButtonProps: {
        label: 'Отмена',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Удалить',
        severity: 'danger',
      },

      accept: () => {
        this.toursService.deleteTour(tour.id).subscribe((data) => {
          this.messageService.add({ severity: 'info', detail: 'Тур удалён' });

          this.toursStore = [...data];
          this.filterTours(this.toursStore);
        });
      },
    });
  }

  setItemToBasket(ev: Event, tour: ITour): void {
    ev.stopPropagation();
    this.basketService.setItemToBasket(tour);
  }

  removeItemToBasket(ev: Event, tour: ITour): void {
    ev.stopPropagation();
    this.basketService.removeItemToBasket(tour);
  }
}
