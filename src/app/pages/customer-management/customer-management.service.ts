import {Injectable} from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { UserService } from '../../shared/user.service';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CustomerManagementService extends SharedService{

  constructor(
   protected http: HttpService,
    private userService: UserService,
  ){
      super(http);
    }

    getAllCustomers() {
      return this.http.get(`api/customer/getexternalcustomer`)
      .map((res) => res.json()).map((res) => {
          return res;
      });

    }


  smartTableData = [
    {
      customerNumber: 1,
      customerName: 'Jack Kelsey',
      isRICustomer: 'Y',
      email: 'jk@reddyice.com',
      contact: '1234567890',
    },
    {
      customerNumber: 2,
      customerName: 'Shaun Michael',
      isRICustomer: 'Y',
      email: 'sm@reddyice.com',
      contact: '8794563210',
    },
    {
      customerNumber: 3,
      customerName: 'Gill Ambrose',
      isRICustomer: 'N',
      email: 'ga@reddyice.com',
      contact: '9456123878',
    },
    {
      customerNumber: 4,
      customerName: 'Bill Courtney',
      isRICustomer: 'Y',
      email: 'bc@reddyice.com',
      contact: '0123645678',
    },
    {
      customerNumber: 5,
      customerName: 'Jill Franko',
      isRICustomer: 'N',
      email: 'jf@reddyice.com',
      contact: '7854512963',
    }
  ];

  products = [
    {
      name: 'Cocktail',
    },
    {
      name: 'BoxIce',
    },
    {
      name: 'Cloudtails',
    },
    {
      name: 'IceBucket',
    },
    {
      name: 'FrankyIce',
    },
  ];

  mappedProds = [
    {
      name: 'Cocktail',
      price: '$1245',
    },
    {
      name: 'BoxIce',
      price: '$5624',
    },
    {
      name: 'Cloudtails',
      price: '$1524',
    },
    {
      name: 'IceBucket',
      price: '$5686',
    },
    {
      name: 'FrankyIce',
      price: '$145',
    },
  ];

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 2000);
    });
  }

  getProducts(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.products);
      }, 2000);
    });
  }

  mappedProducts(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.mappedProds);
      }, 2000);
    });
  }
}
