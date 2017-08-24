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
  constructor(protected service: ManualTicketService) {

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
    this.service.getBranches().subscribe((response) => {
      this.allBranches = response;
    });
  }

  createNewTicket(newCustomer) {
    this.isNewTicket = !this.isNewTicket;
  }
}
