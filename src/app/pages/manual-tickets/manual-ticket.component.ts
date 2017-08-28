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
  disableCreateTicketFields: boolean = false;
  constructor(
    protected service: ManualTicketService,
    protected userService: UserService,
  ) {

  }
  isNewTicket: boolean = false;

  ngOnInit() {
    this.getBranches();
    this.getAllManualTickets();
  }

  getAllManualTickets() {
    const userId = localStorage.getItem('userId') || '';
    this.service.getTickets(userId).subscribe ((response) => {
      this.smartTableData = response;
    });
  }

  getBranches() {
    const user = this.userService.getUser();
    this.service.getBranches(user.UserId).subscribe((response) => {
      this.allBranches = response;
    });
  }

  createNewTicket(callingElement) {
    if (callingElement === 1) {
      this.service.disableCreateTicketFields = false;
    } else if (callingElement === 2) {
      this.service.disableCreateTicketFields = true;
    }
    
    this.isNewTicket = !this.isNewTicket;
  }
}
