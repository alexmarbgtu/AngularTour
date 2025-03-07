import { Injectable } from '@angular/core';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userStore: IUser[] = []
  private currentUser: IUser | null = null

  constructor() { }

  private getUser(login: string): IUser | null {
    return this.userStore.find((user) => login === user.login) || null
  }

  addUser(user: IUser, isRememberMe: boolean): string | void {
    if (this.getUser(user.login)) {
      return 'Пользователь уже существует'
    }
    this.userStore.push(user)
  }

  checkUser(login: string): boolean {
    return !!this.getUser(login)
  }

}
