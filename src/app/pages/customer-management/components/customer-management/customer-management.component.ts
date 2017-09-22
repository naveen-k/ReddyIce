import { CustomerManagementService } from '../../customer-management.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    templateUrl: './customer-management.component.html',
    styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent implements OnInit {

    customers: any[] = [];
    selectedCustomer: any = [];

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
            console.log(err);
        });
    }

    deleteCustomer(ID) {
        //   debugger
        const data = [{ 'CustomerType': '2', 'CustomerId': ID }];
        this.service.deleteCustomer(data).subscribe((res) => {
            console.log("Deleted");
        }, (err) => {
            console.log("Error");
        });

    }

    // updateUserTableOnTypeChange() {
    //     this.customers = this.usersList.filter((u) => {
    //       if (this.userType === 'active') {
    //         return u.IsActive;
    //       }
    //       if (this.userType === 'inActive') {
    //         return !u.IsActive;
    //       }
    //       return true;
    //     });
    //   }
}
