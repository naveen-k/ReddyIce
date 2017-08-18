import { Injectable } from '@angular/core';

@Injectable()
export class DayEndService {

    dataTableData = [{
        'routeNumber': 1,
        'branch': 'NY',
        'isDistributor': 'Y',
        'driver': 'John',
        'trip': '2',
    },
    {
        'routeNumber': 5,
        'branch': 'LA',
        'isDistributor': 'Y',
        'driver': 'Maira',
        'trip':'1',
    },
    {
        'routeNumber': 2,
        'branch': 'Austria',
        'isDistributor': 'N',
        'driver': 'Sam',
        'trip':'2',
    },
    {
        'routeNumber': 4,
        'branch': 'Japan',
        'isDistributor': 'Y',
        'driver': 'Raheem',
        'trip':'1',
    },
    {
        'routeNumber': 3,
        'branch': 'Indonasia',
        'isDistributor': 'N',
        'driver': 'Ahmed',
        'trip':'3',
    },

    ];
  dataTableData2 = [{
        'product': 'Cocktail',
        'load': '112',
        'return': '12',
        'truckDamage': '0',
        'customerDamage': '1',
        'sale': '12',
        'over': '0.00',
    },
    {
        'product': 'Ice Cubes',
        'load': '113',
        'return': '125',
        'truckDamage': '2',
        'customerDamage': '3',
        'sale': '112',
        'over': '0.00',
    },
     {
        'product': 'Ice Cubes',
        'load': '113',
        'return': '125',
        'truckDamage': '2',
        'customerDamage': '3',
        'sale': '112',
        'over': '0.00',
    },
     {
        'product': 'Ice Cubes',
        'load': '113',
        'return': '125',
        'truckDamage': '2',
        'customerDamage': '3',
        'sale': '112',
        'over': '0.00',
    },
     {
        'product': 'Ice Cubes',
        'load': '113',
        'return': '125',
        'truckDamage': '2',
        'customerDamage': '3',
        'sale': '112',
        'over': '0.00',
    },
     {
        'product': 'Ice Cubes',
        'load': '113',
        'return': '125',
        'truckDamage': '2',
        'customerDamage': '3',
        'sale': '112',
        'over': '0.00',
    },
     {
        'product': 'Ice Cubes',
        'load': '113',
        'return': '125',
        'truckDamage': '2',
        'customerDamage': '3',
        'sale': '112',
        'over': '0.00',
    },
    ];
  dataTableData3 = [{
        'custNumber': '121',
        'customer': 'Wallmart',
        'ticket': '2121211',
        'invoiceAmount': '27.0',
        'check': '21.0',
        'cash': '0.00',
        'charge': '0.00',
        'ri': 'N',
        'drayage': '1.00',
        'buyBack': '2.00',
    },
    {
        'custNumber': '122',
        'customer': 'KFC',
        'ticket': '2121212',
        'invoiceAmount': '26.0',
        'check': '22.0',
        'cash': '0.00',
        'charge': '0.00',
        'ri': 'N',
        'drayage': '3.00',
        'buyBack': '10.00',
    },
    {
       'custNumber': '123',
        'customer': 'Mc.Donald',
        'ticket': '2121213',
        'invoiceAmount': '25.0',
        'check': '23.0',
        'cash': '0.00',
        'charge': '0.00',
        'ri': 'Y',
        'drayage': '0.00',
        'buyBack': '0.00',
    },
    {
        'custNumber': '124',
        'customer': 'Big Bazar',
        'ticket': '2121214',
        'invoiceAmount': '24.0',
        'check': '24.0',
        'cash': '0.00',
        'charge': '0.00',
        'ri': 'Y',
        'drayage': '4.00',
        'buyBack': '3.00',
    },
    {
        'custNumber': '125',
        'customer': 'Great Bazar',
        'ticket': '2121215',
        'invoiceAmount': '23.0',
        'check': '25.0',
        'cash': '0.00',
        'charge': '0.00',
        'ri': 'Y',
        'drayage': '1.00',
        'buyBack': '6.00',
    },
    {
       'custNumber': '126',
        'customer': 'India Bulls',
        'ticket': '2121216',
        'invoiceAmount': '22.0',
        'check': '26.0',
        'cash': '0.00',
        'charge': '0.00',
        'ri': 'N',
        'drayage': '10.00',
        'buyBack': '5.00',
    },
    {
        'custNumber': '127',
        'customer': 'GPT',
        'ticket': '2121217',
        'invoiceAmount': '21.0',
        'check': '27.0',
        'cash': '0.00',
        'charge': '0.00',
        'ri': 'Y',
        'drayage': '2.00',
        'buyBack': '7.00',
    },

    ];


    getData(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.dataTableData);
            }, 2000);
        });
    }
     getData2(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.dataTableData2);
            }, 2000);
        });
    }
     getData3(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.dataTableData3);
            }, 2000);
        });
    }
}
