import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss'],
})
export class CreateRequestComponent implements OnInit {
  filter: any = {
		startDate: null,
		todaysDate: null,
		endDate: null,
		requestType:'SRP',
		requestStatus:'all'
	};
  pageTitle: string = 'New Change Request';
  customers = [
    {value: 0, label: 'Select Customer'},
    {value: 1, label: 'Jhon Doe'},
    {value: 2, label: 'Jane Doe'},
  ];

  constructor(
    public activatedRoute: ActivatedRoute,
    protected route: Router,
  ) { }

  ngOnInit() { 
    const now = new Date();
        this.filter.startDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.endDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
   }

   backtomainscreen() {
    this.route.navigate(['view-request']);  
   }
 

}
