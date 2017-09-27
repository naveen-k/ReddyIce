import { CustomerManagementService } from '../../customer-management.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../shared/user.service';
@Component({
    templateUrl: './customer-management.component.html',
    styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent implements OnInit {

    customers: any[] = [];
    // selectedCustomer: any = [];
    isDistributorExist: boolean;
    userSubTitle: string = '';
    constructor(
        protected service: CustomerManagementService,
        private route: ActivatedRoute,
        private userService: UserService,
    ) { }

    ngOnInit() {
        const userId = localStorage.getItem('userId') || '';
        this.userService.getUserDetails(userId).subscribe((response) => {
            this.isDistributorExist = response.IsDistributor;
            this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + response.Distributor.DistributorName : '';
        });
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
        const data = [{ 'CustomerType': 1, 'CustomerId': customerId }];
        this.service.deleteCustomer(data).subscribe((res) => {
            // TODO notification success
        }, (err) => {
            // TODO notification error
        });
        this.getAllCustomers();
    }
}
