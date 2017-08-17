import { ManualTicketService } from '../ticket-management/manual-ticket.service';
import { Component } from '@angular/core';

@Component({
  selector: 'create-new-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
})
export class CreateTicketComponent {
  smartTableData: any;
  ticketObj: any = {};
  constructor(protected service: ManualTicketService) {
    this.smartTableData = service.machineSmartTableData;
  }

  isChecked: boolean = false;
}
