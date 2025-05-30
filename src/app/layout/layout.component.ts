import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, Router, RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { filter, map, Subscription } from 'rxjs';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { AsyncPipe } from '@angular/common';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    FooterComponent,
    HeaderComponent,
    AsideComponent,
    LoaderComponent,
    AsyncPipe,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  showAside = false;
  subscription: Subscription;
  loader$ = inject(LoaderService).loader$;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.showAside = this.recursFindChildData(
      this.activatedRoute.snapshot,
      'showAside'
    );

    this.subscription = this.router.events
      .pipe(
        filter((routes) => routes instanceof ActivationEnd),
        map((data) => data.snapshot)
      )
      .subscribe((data) => {
        this.showAside = this.recursFindChildData(data, 'showAside');
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  recursFindChildData(children: ActivatedRouteSnapshot, prop: string): boolean {
    if (!children.data[prop] && children.firstChild) {
      return this.recursFindChildData(children.firstChild, prop);
    } else {
      return !!children.data[prop];
    }
  }
}
