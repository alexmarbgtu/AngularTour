import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { RegistrationComponent } from './registration/registration.component';
import { AuthorizationComponent } from "./authorization/authorization.component";

@Component({
  selector: 'app-auth',
  imports: [AuthorizationComponent, RegistrationComponent, TabsModule, AuthorizationComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {}
