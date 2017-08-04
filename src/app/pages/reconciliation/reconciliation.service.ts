import { Injectable } from '@angular/core';

@Injectable()
export class ReconciliationService {

    dataTableData = [{
        'routename': 1,
        'location': 'NY',
        'ticketno': '7717',
        'amount': '200',
    },
    {
        'routename': 2,
        'location': 'LA',
        'ticketno': '7716',
        'amount': '300',
    },
    {
        'routename': 3,
        'location': 'Austria',
        'ticketno': '7715',
        'amount': '400',
    },
    {
        'routename': 4,
        'location': 'Africa',
        'ticketno': '7714',
        'amount': '500',
    },
    {
        'routename': 5,
        'location': 'India',
        'ticketno': '7713',
        'amount': '600',
    },
    {
        'routename': 6,
        'location': 'Europe',
        'ticketno': '7712',
        'amount': '700',
    },
    {
        'routename': 7,
        'location': 'Japan',
        'ticketno': '7711',
        'amount': '800',
    },

    ];
  dataTableData2 = [{
        'product': 'Cocktail',
        'load': '112',
        'return': '12',
        'damage': '0',
        'sale': '12',
        'over': '0.00',
    },
    {
        'product': 'Total',
        'load': '112',
        'return': '12',
        'damage': '10',
        'sale': '12',
        'over': '0.00',
    },
    ];
  dataTableData3 = [{
        'custNumber': '121',
        'customer': 'Wallmart',
        'ticket': '2121212',
        'invoiceAmount': '20.0',
        'check': '20.0',
        'cash': '0.00',
        'charge': '0.00',
    },
    {
        'custNumber': '121',
        'customer': 'Wallmart',
        'ticket': '2121212',
        'invoiceAmount': '20.0',
        'check': '20.0',
        'cash': '0.00',
        'charge': '0.00',
    },
    {
       'custNumber': '121',
        'customer': 'Wallmart',
        'ticket': '2121212',
        'invoiceAmount': '20.0',
        'check': '20.0',
        'cash': '0.00',
        'charge': '0.00',
    },
    {
        'custNumber': '121',
        'customer': 'Wallmart',
        'ticket': '2121212',
        'invoiceAmount': '20.0',
        'check': '20.0',
        'cash': '0.00',
        'charge': '0.00',
    },
    {
        'custNumber': '121',
        'customer': 'Wallmart',
        'ticket': '2121212',
        'invoiceAmount': '20.0',
        'check': '20.0',
        'cash': '0.00',
        'charge': '0.00',
    },
    {
       'custNumber': '121',
        'customer': 'Wallmart',
        'ticket': '2121212',
        'invoiceAmount': '20.0',
        'check': '20.0',
        'cash': '0.00',
        'charge': '0.00',
    },
    {
        'custNumber': '121',
        'customer': 'Wallmart',
        'ticket': '2121212',
        'invoiceAmount': '20.0',
        'check': '20.0',
        'cash': '0.00',
        'charge': '0.00',
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
