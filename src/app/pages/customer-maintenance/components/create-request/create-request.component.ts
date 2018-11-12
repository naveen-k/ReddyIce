import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CustomerMaintenanceService } from '../../customer-maintenance.service';
import { ReqItem } from './mock-data';

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
  requestItems = [];

  reqItemData = new ReqItem().reqItem;
  
  constructor(
    public activatedRoute: ActivatedRoute,
    protected router: Router,
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
          this.requestItems = resp[0].RequestItem;
        } else {
          this.changeRequests = [];
          this.requestItems = [];
        }
        this.showLoader = false;
      });
  }

  back() {
    this.router.navigate(['pages', 'customer-maintenance', 'view-request']);  
  }

  submit(request) {
    console.log("Form value===>", request);
  }


}
