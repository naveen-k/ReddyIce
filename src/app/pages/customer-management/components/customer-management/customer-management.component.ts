import { NotificationsService } from 'angular2-notifications/dist';
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
    showSpinner: boolean = false;
    constructor(
        protected service: CustomerManagementService,
        private route: ActivatedRoute,
        private userService: UserService,
        private notification: NotificationsService,
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
        this.showSpinner = true;
        this.service.getAllCustomers().subscribe((res) => {
            this.customers = res;
            this.showSpinner = false;
            // console.log(this.customers);
        }, (err) => {
            // console.log(err);
        });
    }

    deleteCustomer(customerId) {
        const data = [{ 'CustomerType': 2, 'CustomerId': customerId }];
        this.service.deleteCustomer(data).subscribe((res) => {
            this.notification.success("Deleted Succesfully!!");
        }, (err) => {
            this.notification.error("Error in Deleting a customer!!");
        });
        this.getAllCustomers();
    }
}
