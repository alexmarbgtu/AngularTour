import { Component, OnInit } from '@angular/core';
import { ITour } from '../../models/tours';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToursService } from '../../services/tours.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { IOrderData } from '../../models/order';

@Component({
  selector: 'app-order',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputNumberModule,
    InputTextModule,
    DatePickerModule,
    ButtonModule,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit{
  tourId: string = null;
  tour: ITour;
  userForm: FormGroup

  constructor(
    private tourService: ToursService,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.tourId = this.route.snapshot.paramMap.get('id');
    this.tourService.getTourById(this.tourId).subscribe(
      (tour) => {this.tour = tour}
    )

    //reactive form
    this.userForm = new FormGroup({
      firstName: new FormControl('', { validators: Validators.required }),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      cardNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      birthDate: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      citizenship: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    });
  }

  initOrder(): void {
    const userLogin = this.userService.getUser().login;
    const personalData = this.userForm.getRawValue() as IOrderData;
    const postObj = {
      userLogin,
      tourId: this.tour.id,
      personalData: [personalData]
    }
    this.tourService.postOrder(postObj).subscribe()
  }
}
