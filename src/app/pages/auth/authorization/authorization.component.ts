import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../models/user';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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

  constructor(private userService: UserService, private router: Router, private messageService: MessageService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onAuth(): void {
    const postObj = {login: this.login, password: this.password} as IUser
    this.userService.authUser(postObj).subscribe(
      () => {this.router.navigate(['tickets']);},
      () => {
        this.messageService.add({ severity: 'error', detail: 'Ошибка авторизации', life: 3000 });
      }
    )


  }
}
