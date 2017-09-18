import { CustomerManagementService } from '../../customer-management.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/user.service';
import { LocalDataSource } from 'ng2-smart-table';

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

    constructor(protected service: CustomerManagementService) {
        this.mappedProds = service.mappedProds;
        this.products = service.products;
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

    showNewCustomer(newCustomer) {
        this.isNewCustomer = !this.isNewCustomer;
        this.setPrice = false;
    }
    showPrice() {
        this.setPrice = !this.setPrice;
        this.isNewCustomer = false;
    }

}
