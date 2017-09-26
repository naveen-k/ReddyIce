import { CustomerManagementService } from '../../customer-management.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
    templateUrl: './customer-management.component.html',
    styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent implements OnInit {

    customers: any[] = [];
    // selectedCustomer: any = [];

    constructor(
        protected service: CustomerManagementService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.getAllCustomers();
    }


    getAllCustomers() {
        this.service.getAllCustomers().subscribe((res) => {
            this.customers = res;
            // console.log(this.customers);
        }, (err) => {
            // console.log(err);
        });
    }

    deleteCustomer(customerId) {
        const data = [{ 'CustomerType': 1 , 'CustomerId': customerId }];
        this.service.deleteCustomer(data).subscribe((res) => {
            // TODO notification success
        }, (err) => {
            // TODO notification error
        });
        this.getAllCustomers();
    }
}
