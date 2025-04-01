import { Component, OnInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { ITour } from '../../models/tours';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { HightBlockDirective } from '../../shared/directives/hight-block.directive';

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
export class ToursComponent implements OnInit {
  tours: ITour[] = [];
  toursStore: ITour[] = [];

  constructor(
    private toursService: ToursService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
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
    const targetTour = this.tours.find((e, i) => i === index)
    if (targetTour) {
      this.goToTour(targetTour.id)
    }
  }
}
