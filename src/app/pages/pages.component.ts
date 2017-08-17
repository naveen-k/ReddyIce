import { UserService } from '../shared/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top [userDetails]="userDetails"></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">

    </footer>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages implements OnInit {
  userDetails: any;
  _onRouteChange: any;
  _redirectToHome: boolean = false;

  constructor(
    private _menuService: BaMenuService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId') || '';
    this.userService.getUserDetails(userId).subscribe((response) => {
      this.userDetails = response;
      if (this.userDetails.MenuOptions.length) {
        PAGES_MENU[0].children = PAGES_MENU[0].children.filter((child) => {
          let exist = false;
          this.userDetails.MenuOptions.forEach((option) => {
            if (option.Key === child.path) {
              exist = true;
            }
          });
          if (exist) {
            return child;
          }
        });
      }

      this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);

      if (this._redirectToHome) {
        this.router.navigateByUrl(`/pages/${PAGES_MENU[0].children[0].path}`);
      } 
    });

    this._onRouteChange = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._redirectToHome = event.urlAfterRedirects === '/pages';        
        this._onRouteChange.unsubscribe();
      }
    });

  }
}
