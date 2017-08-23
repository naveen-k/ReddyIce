import { UserService } from '../../shared/user.service';
import { ManualTicketService } from './manual-ticket.service';

import { Component, OnInit, NgModule } from '@angular/core';

@Component({
  selector: 'manual-ticket',
  templateUrl: './manual-ticket.component.html',
  styleUrls: ['./manual-ticket.component.scss'],
})

export class ManualTicketComponent implements OnInit {
  smartTableData: any;
  allBranches: any;
  constructor(protected service: ManualTicketService, protected userService: UserService) {
    // this.smartTableData = service.smartTableData;
    // service.getTickets().subscribe (
    //   val => this.smartTableData = val,
    //   // err => console.error(err)
    // );
  }
  isNewTicket: boolean = false;

  ngOnInit() {
  //  this.getCurrentUserDetails();
    this.getBranches();
    this.getAllManualTickets();
  }

  // getCurrentUserDetails() {
  //   this.service.getLoggedInUserDetails().subscribe((response) => {
  //     this.loggedInUserDetails = response;
  //     this.loggedInUser = this.loggedInUserDetails[0].UserId;
  //     console.log(this.loggedInUser);
  //   });
  // }

  getAllManualTickets() {
    const userId = localStorage.getItem('userId') || '';
    this.service.getTickets(userId).subscribe ((response) => {
      this.smartTableData = response;
    });
  }

  getBranches() {
    this.service.getBranches().subscribe((response) => {
      this.allBranches = response;
    });
  }

  createNewTicket(newCustomer) {
    this.isNewTicket = !this.isNewTicket;
  }
}
