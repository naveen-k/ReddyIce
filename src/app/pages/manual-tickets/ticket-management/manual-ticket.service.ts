import {Injectable} from '@angular/core';

@Injectable()
export class ManualTicketService {

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
    {
      machine: 'Product2',
      unit: '$135',
      deliveredBag: '100',
      currentInv: '19',
      damagedBag: '50',
    },
    {
      machine: 'Product3',
      unit: '$145',
      deliveredBag: '135',
      currentInv: '13',
      damagedBag: '12',
    },
    {
      machine: 'Product4',
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
