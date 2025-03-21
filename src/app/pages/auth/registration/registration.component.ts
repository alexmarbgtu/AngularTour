import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { Component, OnChanges, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { Password, PasswordModule } from 'primeng/password';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/api';
import { IUserRegister } from '../../../models/user';
import { Router } from '@angular/router';

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
  title: string = 'Сохранить в хранилище';

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onClick(): void {
    this.userService.addUser(
      { login: this.login, password: this.password, email: this.email },
      this.isRemember
    );
  }

  onAuth(): void {
    const postObj = {login: this.login, password: this.password, email: this.email} as IUserRegister
    this.userService.registerUser(postObj).subscribe(
      () => {
        this.router.navigate(['tours']);
      },
      () => {
        this.initToast('error', 'Пользователь не зарегистрирован')
      }
    )
  }

  initToast(type: 'error' | 'success', text: string): void {
    this.messageService.add({severity: type, detail: text, life: 3000})
  }
}
