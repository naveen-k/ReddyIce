import { UserService } from '../shared/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

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
  constructor(private _menuService: BaMenuService, private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId') || '';
    this.userService.getUserDetails(userId).subscribe((response) => {
      this.userDetails = response;
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
      //console.log(`/pages/${PAGES_MENU[0].children[0].path}`);
      this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
      this.router.navigateByUrl(`/pages/${PAGES_MENU[0].children[0].path}`);
    });
    // this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    // this.router.navigateByUrl(`/pages/${PAGES_MENU[0].children[0].path}`);

    // filter menus based on user


  }
}
