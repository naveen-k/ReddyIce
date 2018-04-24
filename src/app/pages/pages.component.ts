import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Routes } from '@angular/router';

import { PAGES_MENU } from './pages.menu';

@Component({
  selector: 'pages',
  template: `
        <router-outlet></router-outlet>
    `
})
export class Pages implements OnInit {
  _onRouteChange: any;
  _redirectToHome: boolean = false;

  constructor(

    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {

    this._onRouteChange = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._redirectToHome = event.urlAfterRedirects === '/pages';
        this._onRouteChange.unsubscribe();
      }
    });

  }
}
