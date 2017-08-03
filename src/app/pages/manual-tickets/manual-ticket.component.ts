import { Component } from '@angular/core';

@Component({
  selector: 'manual-ticket',
  templateUrl: './manual-ticket.component.html',
  styleUrls: ['./manual-ticket.component.scss'],
})
export class ManualTicketComponent {
  constructor() {}
  isNewCustomer: boolean = true;

  showNewCustomer(newCustomer) {
    this.isNewCustomer = newCustomer;
  }
}
