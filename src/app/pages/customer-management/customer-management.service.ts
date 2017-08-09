import {Injectable} from '@angular/core';

@Injectable()
export class CustomerManagementService {

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
      email: 'jk@reddyice.com',
      contact: '1234567890',
    },
    {
      customerNumber: 3,
      customerName: 'Gill Ambrose',
      isRICustomer: 'N',
      email: 'jk@reddyice.com',
      contact: '1234567890',
    },
    {
      customerNumber: 4,
      customerName: 'Bill Courtney',
      isRICustomer: 'Y',
      email: 'jk@reddyice.com',
      contact: '1234567890',
    },
    {
      customerNumber: 5,
      customerName: 'Jill Franko',
      isRICustomer: 'N',
      email: 'jk@reddyice.com',
      contact: '1234567890',
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
