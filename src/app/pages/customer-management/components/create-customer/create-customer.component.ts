import { Customer, DualListItem, mProducts } from '../../../../shared/interfaces/interfaces';
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

    addedProduct: mProducts[] = [];
    newlyAddedproduct: mProducts[] = [];

    keepSorted = true;

    action: string = 'create';

    customerId: string;


    constructor(protected service: CustomerManagementService,
        protected route: ActivatedRoute,
    ) {
        this.customerId = this.route.snapshot.params['CustomerId'].split('-')[0];
        this.action = this.route.snapshot.params['CustomerId'].split('-')[1];

    }

    ngOnInit() {
        if (this.action === 'view' || this.action === 'edit') {
            this.service.getCustomer(this.customerId).subscribe((response) => {
                this.customer = response.CustomerDetails;
                this.addedProduct = response.ProductDetail;
                console.log(response);
            });
        }
        this.service.getExternalProducts().subscribe((response) => {
            this.products = response;
        });
    }
    addProduct() {
      
        if (this.action == 'create') {
            this.addedProduct.push({} as mProducts);
        }
        else {
            this.newlyAddedproduct.push({} as mProducts);
        }


    }

    save() {
       
        if(this.action == 'edit') { 
            this.addedProduct = this.addedProduct.concat(this.newlyAddedproduct); 
            this.customer.MappedProducts = this.addedProduct;
      
            console.log(this.customer);
            this.service.updateCustomer(this.customerId, this.customer).subscribe((res) => {
                console.log(res);
            }, (err) => {
                console.log(err);
            });

        }
        else{
        this.customer.MappedProducts = this.addedProduct;
        console.log(this.customer);
        this.service.createCustomer(this.customer).subscribe((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        });
    }
    }

}
