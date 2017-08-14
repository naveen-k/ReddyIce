import { UserService } from '../shared/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
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

  constructor(private _menuService: BaMenuService, private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    const user = this.userService.getUser() || {};

    // filter menus based on user
    PAGES_MENU[0].children = PAGES_MENU[0].children.filter((child) => {      
      return !!user[child.path];
    });
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
    this.router.navigateByUrl(`/pages/${PAGES_MENU[0].children[0].path}`);
  }
}
