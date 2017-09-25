import { Customer, DualListItem, MProducts } from '../../../../shared/interfaces/interfaces';
import { CustomerManagementService } from '../../customer-management.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.scss'],
})

export class CreateCustomerComponent implements OnInit {

    customer: Customer = <Customer>{};

    products: any[] = [];

    selectedProducts: DualListItem[] = [];

    addedProduct: MProducts[] = [];
    newlyAddedproduct: MProducts[] = [];

    keepSorted = true;

    // action: string = 'create';

    customerId: string;
    
    mode: number; // 1-Create Mode, 2-Edit Mode, 3-View Mode 


    constructor(protected service: CustomerManagementService,
        protected route: ActivatedRoute,
    ) {
        this.customerId = this.route.snapshot.params['customerId'];
        this.mode = +this.route.snapshot.data['mode'];
    }

    ngOnInit() {
        if (this.mode === 2 || this.mode === 3) {
            this.service.getCustomer(this.customerId).subscribe((response) => {
                this.customer = response.CustomerDetails;
                this.addedProduct = response.ProductDetail;
                // console.log(this.addedProduct);
            });
        }
        this.service.getExternalProducts().subscribe((response) => {
            this.products = response;
        });
    }
    addProduct() {
        if (this.mode === 1) {
            this.addedProduct.push({} as MProducts);
        } else {
            this.newlyAddedproduct.push({} as MProducts);
        }
    }

    save() {
        if (this.mode === 2) {
            this.addedProduct = this.addedProduct.concat(this.newlyAddedproduct);
            this.customer.MappedProducts = this.addedProduct;
            this.service.updateCustomer(this.customerId, this.customer).subscribe((res) => {
            }, (err) => {

            });

        } else {
            this.customer.MappedProducts = this.addedProduct;
            this.service.createCustomer(this.customer).subscribe((res) => {
            }, (err) => {
            });
        }
    }

}
