import { ManaulTicket } from './manaul-ticket.interfaces';
import { Http } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { SharedService } from '../../shared/shared.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class ManualTicketService extends SharedService {
  result: any;
  constructor(protected http: HttpService, private tmpHttp: Http ) {
    super(http);
  }

  getTickets(userId: any): Observable<ManaulTicket[]> {
    return this.http.get(`api/manualticket/userid?userId=${userId}`)
    .map(res => res.json());
  }
  
  getTicketTypes() {
    return this.http.get(`api/manualticket/ticketType`)
    .map(res => res.json());
  }
  
  getProducts() {
    return this.http.get(`api/product`)
    .map(res => res.json());
  }

  getBranchBasedCustomers(branchId: string) {
    return this.http.get(`api/customer?branchID=${branchId}`)
    .map(res => res.json());
  }

  getCustomerBasedProducts(customerId: string) {
    return this.http.get(`api/product?CustomerId=${customerId}`)
    .map(res => res.json());
  }

  checkTicketNumber(ticketNumber: any) {
    return this.http.get(`api/manualticket/checkticketnumber?number=${ticketNumber}`)
    .map(res => res.json());
  }
    

  dsdSmartTableData = [
    {
      product: 'Product1',
      unit: '$125',
      unitPrice: '$1.25',
      totalAmount: '$125.00',
    },
  ];

  pbmSmartTableData = [
    {
      machine: 'Product1',
      unit: '$125',
      deliveredBag: '135',
      currentInv: '5',
      damagedBag: '59',
      previousReading: '1231',
      currentReading: '1356',
      totalUnit: '125',
    },
  ];

  pbsSmartTableData = [
    {
      product: 'Product1',
      unit: '$125',
      deliveredBag: '125',
      currentInv: '12',
    },
  ];

  disableCreateTicketFields = false;
}
