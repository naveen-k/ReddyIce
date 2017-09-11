import {Component, Input,OnInit} from '@angular/core';

import {GlobalState} from '../../../global.state';

import { UserService } from '../../../shared/user.service';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop implements OnInit {
  @Input() userDetails:any;
  
  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;
  public logedInUser:any={};
  public showReset:boolean=false;

  ngOnInit() {
    
  }

  constructor(private _state:GlobalState, private userService: UserService) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    this.logedInUser = this.userService.getUser();
  
       this.showReset = this.logedInUser.IsRIInternal;
       console.log( this.showReset);
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }
}
