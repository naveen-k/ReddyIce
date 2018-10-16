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
  
  pageTitle: string = 'New Manual Ticket';


  constructor(
    public activatedRoute: ActivatedRoute,
    protected route: Router,
  ) { }

  ngOnInit() {
	  console.log('pritika');
  }
 

}
