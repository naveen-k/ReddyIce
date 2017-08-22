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
    // this.smartTableData = service.smartTableData;
    service.getTickets().subscribe (
      val => this.smartTableData = val,
      // err => console.error(err)
    );
  }
  isNewTicket: boolean = false;

  ngOnInit() {
    this.getBranches();
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
