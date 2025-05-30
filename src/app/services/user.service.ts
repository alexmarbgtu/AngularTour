import { Injectable } from '@angular/core';
import { IUser, IUserRegister, userToken } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { API } from '../shared/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private userStore: IUser[] = []
  private currentUser: IUser | null = null

  constructor(private http: HttpClient) { }

  // private getUser(login: string): IUser | null {
  //   return this.userStore.find((user) => login === user.login) || null
  // }

  // addUser(user: IUser, isRememberMe: boolean): string | void {
  //   if (this.getUser(user.login)) {
  //     return 'Пользователь уже существует'
  //   }
  //   this.userStore.push(user)
  // }

  // checkUser(login: string): boolean {
  //   return !!this.getUser(login)
  // }

  registerUser(user: IUserRegister): Observable<string> {
    return this.http.post(API.registration, user, {responseType: 'text'})
  }

  authUser(user: IUser): Observable<string> {
    return this.http.post(API.auth, user, { responseType: 'text' });
  }

  getUser(): IUser {
    const sessionUser: IUser = JSON.parse(sessionStorage.getItem(userToken));
    return this.currentUser || sessionUser;
  }

  setUser(user: IUser): void {
    this.currentUser = user
    if (user !== null) {
      sessionStorage.setItem(userToken, JSON.stringify({login:user.login}));
    } else {
      sessionStorage.removeItem(userToken)
    }
  }
}
