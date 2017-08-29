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
  showCreateTicketPanel: boolean = false;
  showViewTicketPanel: boolean = false;
  cardTitle: string = '';
  user: any;
  isNewTicket: boolean = false;
  showAllTicketsRadioButton: boolean = false;
  constructor(
    protected service: ManualTicketService,
    protected userService: UserService,
  ) {

  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.getBranches();
    this.getAllManualTickets();
    if (this.user.Role.RoleName === 'ITAdmin') {
      this.showAllTicketsRadioButton = false;
    } else if (this.user.Role.RoleName === 'Driver') {
      this.showAllTicketsRadioButton = true;
    }
  }

  getAllManualTickets() {
    const userId = localStorage.getItem('userId') || '';
    this.service.getTickets(userId).subscribe ((response) => {
      this.smartTableData = response;
    });
  }

  getBranches() {
    
    this.service.getBranches(this.user.UserId).subscribe((response) => {
      this.allBranches = response;
    });
  }

  createNewTicket(callingElement) {
    if (callingElement === 1) {
      this.service.disableCreateTicketFields = false;
      this.showCreateTicketPanel = true;
      this.showViewTicketPanel = false;
      this.cardTitle = "Create New Ticket"
    } else if (callingElement === 2) {
      this.service.disableCreateTicketFields = true;
      this.showCreateTicketPanel = true;
      this.showViewTicketPanel = false;
      this.cardTitle = "Edit Ticket Details"
    } else if (callingElement === 3) {
      this.service.disableCreateTicketFields = true;
      this.showCreateTicketPanel = false;
      this.showViewTicketPanel = true;
    }
    
    this.isNewTicket = !this.isNewTicket;
  }
}
