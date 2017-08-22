import { HttpService } from '../../shared/http.service';
import { SharedService } from '../../shared/shared.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class ManualTicketService extends SharedService {
  result: any;
  constructor(protected http: HttpService) {
    super(http);
  }
  getTickets() {
    // return this._http.get('../../shared/manualTicket.json')
    return this.http.get('./assets/mock-json/manualTicket.json')
    .map(res => res.json());
  }
  smartTableData = [
    {
      ticketId: 6776237,
      customerId: 123,
      amount: '200$',
      status: 'Approved',
    },
    {
      ticketId: 6776247,
      customerId: 456,
      amount: '128$',
      status: 'Approved',
    },
    {
      ticketId: 6776257,
      customerId: 789,
      amount: '158$',
      status: 'Approved',
    },
    {
      ticketId: 6776267,
      customerId: 102,
      amount: '178$',
      status: 'Approved',
    },
  ];

  machineSmartTableData = [
    {
      machine: 'Product1',
      unit: '$125',
      deliveredBag: '125',
      currentInv: '12',
      damagedBag: '54',
    },
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 2000);
    });
  }
}
