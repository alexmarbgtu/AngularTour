import { DatePipe } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/user';
import { MenubarModule } from 'primeng/menubar'
import { ButtonModule } from 'primeng/button'
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [DatePipe, MenubarModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  dateTime: Date = new Date();
  user: IUser;
  menuItems: MenuItem[] = [];
  logoutIcon: string = 'pi pi-user';

  constructor(
    private userService: UserService,
    private router: Router
  ) // private ngZone: NgZone
  {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.menuItems = this.initMenuItems();
    // this.ngZone.runOutsideAngular(() => {
    //   setInterval(() => {
    //     this.dateTime = new Date();
    //   }, 1000);
    // })

    setInterval(() => {
      this.dateTime = new Date();
    }, 1000);
  }

  initMenuItems(): MenuItem[] {
    return [
      {
        label: 'Билеты',
        routerLink: ['/tours'],
      },
      {
        label: 'Настройки',
        routerLink: ['/settings'],
      },
      {
        label: 'Заказы',
        routerLink: ['/orders'],
      },
    ];
  }

  logOut(): void {
    this.userService.setUser(null);
    this.router.navigate(['/auth']);
  }

  hoverLogoutBtn(val: boolean): void {
    this.logoutIcon = val ? 'pi pi-sign-out' : 'pi pi-user';
  }
}
