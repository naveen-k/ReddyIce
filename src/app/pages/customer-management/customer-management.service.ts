import {Injectable} from '@angular/core';

@Injectable()
export class CustomerManagementService {

  smartTableData = [
    {
      customerNumber: 1,
      customerName: 'Jack Kelsey',
      isRICustomer: 'Y',
    },
    {
      customerNumber: 2,
      customerName: 'Shaun Michael',
      isRICustomer: 'Y',
    },
    {
      customerNumber: 3,
      customerName: 'Gill Ambrose',
      isRICustomer: 'N',
    },
    {
      customerNumber: 4,
      customerName: 'Bill Courtney',
      isRICustomer: 'Y',
    },
    {
      customerNumber: 5,
      customerName: 'Jill Franko',
      isRICustomer: 'N',
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
