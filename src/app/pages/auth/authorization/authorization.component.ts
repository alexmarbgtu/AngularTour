import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../models/user';

@Component({
  selector: 'app-authorization',
  imports: [
    NgClass,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    PasswordModule,
  ],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
})
export class AuthorizationComponent implements OnInit, OnDestroy {
  login: string = '';
  password: string;
  isRemember: boolean;
  isLogin: boolean = false;
  isPassword: boolean = false;
  title: string = 'Сохранить в хранилище';

  constructor(
    private userService: UserService,
  ) {
    const user: IUser = {
      login: this.login,
      password: this.password,
    };
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
