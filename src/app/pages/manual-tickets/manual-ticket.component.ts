import { ManualTicketService } from './ticket-management/manual-ticket.service';
import { Component } from '@angular/core';

@Component({
  selector: 'manual-ticket',
  templateUrl: './manual-ticket.component.html',
  styleUrls: ['./manual-ticket.component.scss'],
})

export class ManualTicketComponent {
  smartTableData: any;
  constructor(protected service: ManualTicketService) {
    this.smartTableData = service.smartTableData;
  }
  isNewTicket: boolean = false;

  createNewTicket(newCustomer) {
    this.isNewTicket = !this.isNewTicket;
  }
}
