import { CustomerManagementService } from '../../customer-management.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/user.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
    templateUrl: './setprice.component.html',
    styleUrls: ['./setprice.component.scss'],
})

export class SetPriceComponent implements OnInit {
    smartTableData: any;
    products: any;
    mappedProds: any;
    isNewCustomer: boolean = false;
    setPrice: boolean = false;
    customerObj: any = {};
    externalProducts: any = [];

    constructor(protected service: CustomerManagementService, private router: Router, public activatedRoute: ActivatedRoute,
        protected route: Router) {
        // this.mappedProds = service.mappedProds;
        // this.products = service.products;
    }

    ngOnInit() {
        this.getExternalProducts();
    }

    getExternalProducts() {
        this.service.getExternalProducts().subscribe((res) => {
            this.externalProducts = res;
            console.log(this.externalProducts);
        }, (err) => {
            console.log(err);
        });
    }

    setGenericPrice() {
        this.service.setGenericPrice(this.externalProducts).subscribe((res) => {
            console.log("Data Sent");
            this.service.getAllCustomers();
            this.route.navigate(['../list'], { relativeTo: this.activatedRoute });
        }, (err) => {
            console.log("Error Sending Data");
        });
    }


    showNewCustomer(newCustomer) {
        this.isNewCustomer = !this.isNewCustomer;
        this.setPrice = false;
    }

    
    showPrice() {
        this.setPrice = !this.setPrice;
        this.isNewCustomer = false;
    }

}
