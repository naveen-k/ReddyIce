import { CustomerManagementService } from '../../customer-management.service';
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './customer-management.component.html',
    styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent implements OnInit {

    customers: any[] = [];

    constructor(protected service: CustomerManagementService) {}

    ngOnInit() {
        this.getAllCustomers();
    }
  

    getAllCustomers() {
        this.service.getAllCustomers().subscribe((res) => {
            // this.customers = res;
            // console.log(this.customers);
        }, (err) => {
            console.log(err);
        });
    }
}
