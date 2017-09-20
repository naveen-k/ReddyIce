import { Customer, DualListItem, mProducts } from '../../../../shared/interfaces/interfaces';
import { CustomerManagementService } from '../../customer-management.service';
import { Component, OnInit } from '@angular/core';
import { DualListComponent } from 'angular-dual-listbox/index';


@Component({
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.scss'],
})

export class CreateCustomerComponent implements OnInit {

    customer: Customer = <Customer>{};

    products: any[] = [];

    selectedProducts: DualListItem[] = [];

    addedProduct: mProducts[] = [];

    keepSorted = true;


    constructor(protected service: CustomerManagementService) { }

    ngOnInit() {
        this.service.getExternalProducts().subscribe((response) => {
            this.products = response;
        });
    }
    addProduct() {
        this.addedProduct.push({} as mProducts);
    }
   
    save() {
        this.customer.MappedProducts = this.addedProduct;
        console.log(this.customer);
        this.service.createCustomer(this.customer).subscribe((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        });

    }

}
