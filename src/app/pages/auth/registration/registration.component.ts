import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { Component, OnChanges, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-registration',
  imports: [
    NgClass,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    PasswordModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  login: string = '';
  password: string;
  repPassword: string;
  email: string;
  isRemember: boolean;
  isLogin: boolean = false;
  isPassword: boolean = false;
  isEmail: boolean = false;
  title:string = "Сохранить в хранилище";

  constructor(private userService: UserService) {}

  ngOnInit(): void {

  }

  onClick(): void {
    this.userService.addUser({login: this.login, password: this.password, email: this.email}, this.isRemember)
  }

}
