import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Customer, DualListItem, MProducts } from '../../../../shared/interfaces/interfaces';
import { CustomerManagementService } from '../../customer-management.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

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
        protected router: Router,
        private notification: NotificationsService,
        protected modalService: NgbModal,
    ) {
        this.customerId = this.route.snapshot.params['customerId'];
        this.mode = +this.route.snapshot.data['mode'];
    }

    ngOnInit() {
        if (this.mode === 2 || this.mode === 3) {
            this.service.getCustomer(this.customerId).subscribe((response) => {
                this.customer = response.CustomerDetails;
                this.addedProduct = response.ProductDetail;
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
                this.router.navigate(['../../list'], { relativeTo: this.route });
            }, (err) => {

            });

        } else {
            this.customer.MappedProducts = this.addedProduct;
            this.service.createCustomer(this.customer).subscribe((res) => {
            }, (err) => {
            });
        }
    }

    deactivateMappedProduct(mprod) {
        const index = this.addedProduct.indexOf(mprod);
        if (this.mode === 2 || index > -1) {
            this.addedProduct.splice(index, 1);
            this.addedProduct = this.addedProduct;

        }
    }

    productChangeHandler(mprod) {        
        const product = this.addedProduct.filter(t => t.ExternalProductID === mprod.ExternalProductID);
        const product1 = this.newlyAddedproduct.filter(t => t.ExternalProductID === mprod.ExternalProductID);
        if (product.length === 2 || product1.length === 2 ) {
            mprod.ExternalProductID = '';
            const activeModal = this.modalService.open(ModalComponent, {
                size: 'sm',
                backdrop: 'static',
            });
            activeModal.componentInstance.BUTTONS.OK = 'OK';
            activeModal.componentInstance.modalHeader = 'Warning!';
            activeModal.componentInstance.modalContent = `Product already selected! You cannot select same product again.`;
            activeModal.componentInstance.closeModalHandler = (() => {
            });
            return;
        } else {
            mprod.ProductPrice = this.products.filter(prod => +prod.ExternalProductId === +mprod.ExternalProductID)[0].ProductPrice;
        }
    }

}
