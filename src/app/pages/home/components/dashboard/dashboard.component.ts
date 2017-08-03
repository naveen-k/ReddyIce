import { Component, OnInit } from '@angular/core';

import { DashboardService } from './dashboard.service';

@Component({  
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})

export class DashboardComponent implements OnInit {

  data: any;

  constructor(private _dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.data = this._dashboardService.getAll();
  }

  getResponsive(padding, offset) {
    return this._dashboardService.getResponsive(padding, offset);
  }
}
