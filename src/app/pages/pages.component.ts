import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Routes } from '@angular/router';
import { slideInOutAnimation } from '../_animations/index';
import { PAGES_MENU } from './pages.menu';

@Component({
  selector: 'pages',
  template: `
        <router-outlet></router-outlet>
    `,
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})
export class Pages implements OnInit {
  _onRouteChange: any;
  _redirectToHome: boolean = false;

  constructor(

    private activatedRoute: ActivatedRoute,
    private router: Router) {
      
  }

  ngOnInit() {

    //this.router.navigateByUrl('/login');
    // this._onRouteChange = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this._redirectToHome = event.urlAfterRedirects === '/pages';
    //     this._onRouteChange.unsubscribe();
    //   }
    // });

  }
}
