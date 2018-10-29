import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CustomerMaintenanceService } from '../../customer-maintenance.service';

@Component({
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss'],
})
export class CreateRequestComponent implements OnInit {
  filter: any = {
		startDate: null,
		todaysDate: null,
		endDate: null,
		requestType: 0,
		requestStatus:'all'
  };
  showLoader = false;
  pageTitle: string = 'New Change Request';
  changeRequests = [];
  
  constructor(
    public activatedRoute: ActivatedRoute,
    protected route: Router,
    private custMaintenanceService: CustomerMaintenanceService
  ) { }

  ngOnInit() { 
    const now = new Date();
        this.filter.startDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.endDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    }

  changeRequest() {
    this.showLoader = true;
    this.custMaintenanceService.getChangeRequests(this.filter.requestType)
      .subscribe(resp => {
        if (resp.length) {
          this.changeRequests = resp[0].RequestHeader;
        } else {
          this.changeRequests = [];
        }
        this.showLoader = false;
      });
  }

  backtomainscreen() {
  this.route.navigate(['view-request']);  
  }


}
