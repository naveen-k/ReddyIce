import { Customer } from '../../../../shared/interfaces/interfaces';
import { CustomerManagementService } from '../../customer-management.service';
import { Component, OnInit } from '@angular/core';
import { DualListComponent } from 'angular-dual-listbox/index';


@Component({
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.scss'],
})

export class CreateCustomerComponent implements OnInit {

    customer: Customer = <Customer>{};
    products: any;
    keepSorted = true;
    confirmed: Array<any> =
    [
        {
            "key": 1,
            "station": "Antonito",
            "state": "CO"
        },
        {
            "key": 2,
            "station": "Big Horn",
            "state": "NM"
        },
    ]
    source: Array<any> =
    [
        {
            "key": 1,
            "station": "Antonito",
            "state": "CO"
        },
        {
            "key": 2,
            "station": "Big Horn",
            "state": "NM"
        },
        {
            "key": 3,
            "station": "Sublette",
            "state": "NM"
        },
        {
            "key": 4,
            "station": "Toltec",
            "state": "NM"
        },
        {
            "key": 5,
            "station": "Osier",
            "state": "CO"
        },
        {
            "key": 6,
            "station": "Chama",
            "state": "NM"
        },
        {
            "key": 7,
            "station": "Monero",
            "state": "NM"
        },
        {
            "key": 8,
            "station": "Lumberton",
            "state": "NM"
        },
        {
            "key": 9,
            "station": "Duice",
            "state": "NM"
        },
        {
            "key": 10,
            "station": "Navajo",
            "state": "NM"
        },
        {
            "key": 11,
            "station": "Juanita",
            "state": "CO"
        },
        {
            "key": 12,
            "station": "Pagosa Jct",
            "state": "CO"
        },
        {
            "key": 13,
            "station": "Carracha",
            "state": "CO"
        },
        {
            "key": 14,
            "station": "Arboles",
            "state": "CO"
        },
        {
            "key": 15,
            "station": "Solidad",
            "state": "CO"
        },
        {
            "key": 16,
            "station": "Tiffany",
            "state": "CO"
        },
        {
            "key": 17,
            "station": "La Boca",
            "state": "CO"
        },
        {
            "key": 18,
            "station": "Ignacio",
            "state": "CO"
        },
        {
            "key": 19,
            "station": "Oxford",
            "state": "CO"
        },
    ];

    constructor(protected service: CustomerManagementService) { }

    ngOnInit() {
        // console.log(this.customer);
    }

}