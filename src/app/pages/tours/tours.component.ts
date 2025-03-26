import { Component, OnInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { ITour } from '../../models/tours';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tours',
  imports: [CardModule],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
})
export class ToursComponent implements OnInit {

  tours: ITour[] = []

  constructor(
    private toursService: ToursService,
    private route: ActivatedRoute,
    private router: Router) {}

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

  goToTour(id: string) {
    console.log(id);

    this.router.navigate([id], {relativeTo: this.route})
  }
}
