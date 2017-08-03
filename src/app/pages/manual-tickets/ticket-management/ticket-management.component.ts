import { Component } from '@angular/core';

import { ManualTicketService } from './manual-ticket.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ticket-table',
  templateUrl: './ticket-management.component.html',
  styleUrls: ['./ticket-management.component.scss'],
})
export class TicketManagementComponent {

  query: string = '';

  settings = {
    selectMode: 'single',
    actions: {
      edit: false,
    },
    add: {
      addButtonContent: '',
    },
    delete: {
      deleteButtonContent: '<i class="ion-edit"></i>',
      confirmDelete: true
    },
    columns: {
      ticketId: {
        title: 'Ticket No',
        type: 'number'
      },
      customerId: {
        title: 'Customer#',
        type: 'number'
      },
      amount: {
        title: 'Amount($)',
        type: 'string'
      },
      status: {
        title: 'Status',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(protected service: ManualTicketService) {
    this.service.getData().then((data) => {
      this.source.load(data);
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to Edit?')) {
      //event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
