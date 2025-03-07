import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnChanges, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';

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
export class AuthorizationComponent {
  login: string = '';
  password: string;
  isRemember: boolean;
  isLogin: boolean = false;
  isPassword: boolean = false;
  title: string = 'Сохранить в хранилище';
}
