import { ManualTicket } from './manaul-ticket.interfaces';
import { Customer } from '../../shared/interfaces/interfaces';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { SharedService } from '../../shared/shared.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { CacheService } from 'app/shared/cache.service';

@Injectable()
export class ManualTicketService extends SharedService {
  result: any;
  _searchObject: any = {};

  constructor(protected http: HttpService, private tmpHttp: Http, 
    protected cache:CacheService) {
    super(http, cache);
  }
  getsourceoptions(lookUpDefType: string):  Observable<any> {
        const url = `api/GetLookUp?lookUpDefType=${lookUpDefType}`;
       return this.http.get(url).map((res) =>  
        res.json()
       );
	}
  getAllTickets(createdDate, branchId,isRI,driverId,ticketSource): Observable<any[]> {
	 let url = `api/manualticket/getalltickets?CreatedDate=${createdDate}&branchId=${branchId}&ISRI=${isRI}&DriverId=${driverId}&ticketSource=${ticketSource}`;
   
   
    
    return this.http.get(url)
      .map(res => res.json())
      .map(res => res.ManualTicket)
      .map(res => {
        if (res) {
          res.forEach(element => {
            element['Customer'] = {
              CustomerID: element.CustomerID,
              CustomerName: element.CustomerName,
              CustomerType: element.CustomerTypeID,
              CustomerNumber: element.CustomerNumber,
              AXCustomerNumber: element.AXCustomerNumber,
            };
          })
        }
        return res;
      })

  }

  approveAllCheckedTickets(approveTicketsObj) {
    return this.http.put('api/manualticket/workflow', approveTicketsObj).map((res => res.json()));
  }

  deleteAllCheckedTickets(deleteTicketsObj) {console.log(deleteTicketsObj,'deleteTicketsObj');
    return this.http.post('api/manualticket/deletemultipleticket', deleteTicketsObj).map((res => res.json()));
  }

  getTicketTypes() {
	   if (this.cache.has("customerTypedata")) { return this.cache.get("customerTypedata"); }
    return this.http.get(`api/manualticket/CustomerType`).map(res => {
		let customerTypedataset:any = [];
	customerTypedataset = res.json();
	this.cache.set("customerTypedata", customerTypedataset);
	return customerTypedataset;
	});
  }

  getProducts() {
    return this.http.get(`api/product`)
      .map(res => res.json());
  }

  getBranchBasedCustomers(branchId: number): Observable<Customer[]> {
    return this.http.get(`api/customer?branchID=${branchId}`)
      .map(res => res.json());
  }

  getTypeBasedCustomers(custType: number, distcopackerid?: number): Observable<Customer[]> {
    let url = `api/customer?custType=${custType}`;
    if (distcopackerid) {
      url = `api/customer?custType=${custType}&distcopackerid=${distcopackerid}`
    }
    return this.http.get(url)
      .map(res => res.json().Customer || res.json());
  }

  getCustomerDetail(customerId: number, isInternal: boolean = true): Observable<Customer> {
    return this.http.get(`api/customer?customerid=${customerId}&isInternal=${isInternal}`).map((res) => res.json());
  }

  getCustomerBasedProducts(customerId: string) {
    return this.http.get(`api/product?CustomerId=${customerId}`)
      .map(res => res.json());
  }

  checkTicketNumber(ticket: ManualTicket) {
    return this.http.post(`api/manualticket/checkticketnumber`, ticket)
      .map(res => res.json());
  }

  getTicketById(ticketId): Observable<ManualTicket[]> {
    return this.http.get(`api/manualticket?ticketId=${ticketId}`)
      .map(res => res.json());
  }

  saveTicket(ticket: ManualTicket): Observable<any> {
	  console.log(ticket);
    return this.http.post(`api/manualticket`, ticket).map((res) => 
	{console.log(res);
		res.json();
	}
	);
  }

  updateTicket(ticket: ManualTicket): Observable<any> {
    return this.http.put(`api/manualticket/updateticket?ticketid=${ticket.TicketID}`, ticket)
      .map(res => res.json());
  }

  deleteDraftTicket(ticketId: any) {
    return this.http.delete(`api/manualticket/?ticketid=${ticketId}`)
      .map(res => res.json());
  }

  getSearchedObject(): any {
    return this._searchObject;
  }

  getImageByID(imageID): any {
    return this.http.get(`api/manualticket/getimage?imageid=${imageID}`)
      .map(res => res.json());
  }

  deleteImageByID(imageID, TicketID): any {
    return this.http.delete(`api/manualticket/deleteimage?imageId=${imageID}&ticketId=${TicketID}`)
      .map(res => res.json());
  }
  getSaleCreditTicket(ticketId, CustomerId, deliveryDate) {
    return this.http.get(`api/manualticket/getcomboticketsid?TicketNumber=${ticketId}&CustomerId=${CustomerId}&DeliveryDate=${deliveryDate}`)
      .map(res => res.json());
  }

  /* fileUpload() {
    const fileObj = {
      'ImageTypeID': 1,
      'Image': 'QEA=',
      'Created': '2017-08-31',
      'CreatedBy': 3,
    };
    return this.http.post('api/manualticket/uploadImage', fileObj).map((res) => res.json());
  }
  */
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
