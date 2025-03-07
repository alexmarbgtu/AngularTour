import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { RegistrationComponent } from './registration/registration.component';
import { AuthorizationComponent } from "./authorization/authorization.component";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { delay } from 'rxjs';

@Component({
  selector: 'app-auth',
  imports: [
    AuthorizationComponent,
    RegistrationComponent,
    TabsModule,
    AuthorizationComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
        })
      ),
      // transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.6s')]),
    ]),
  ],
})
export class AuthComponent {
  isAuth: boolean = true;
  isReg: boolean = false;

  toggleAuth() {
    this.isAuth = true;
    this.isReg = false;
  }
  toggleReg() {
    this.isAuth = false;
    this.isReg = true;
  }
}
