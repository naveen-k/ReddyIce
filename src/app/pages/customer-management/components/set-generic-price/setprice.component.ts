import { NotificationsService } from 'angular2-notifications';
import { MProducts } from '../../../../shared/interfaces/interfaces';
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
    externalProducts: any = [];
    newProductList: any = [];
    isProductAlreadyExist: boolean = false;
    editClicked: any = [];
    isFormTouched: boolean = false;
    isDistributorExist: boolean;
    userSubTitle: string = '';
    showSpinner: boolean = false;

    constructor(
        protected service: CustomerManagementService,
        public activatedRoute: ActivatedRoute,
        protected route: Router,
        protected notification: NotificationsService,
        protected userService: UserService,
    ) { }

    ngOnInit() {
        this.getExternalProducts();
        const userId = localStorage.getItem('userId') || '';
        this.userService.getUserDetails(userId).subscribe((response) => {
            this.isDistributorExist = response.IsDistributor;
            this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + response.Distributor.DistributorName : '';
        });
    }

    getExternalProducts() {
        this.showSpinner = true;
        this.service.getExternalProducts().subscribe((res) => {
            this.externalProducts = res;
            this.showSpinner = false;
            this.editClicked = new Array(this.externalProducts.length);
            this.editClicked.fill(false);
        }, (err) => {
        });
    }

    setGenericPrice() {
        const priceProduct = { 'SetGenricPrice': this.externalProducts, 'AddNewExternalProduct': this.newProductList }
        this.service.setGenericPrice(priceProduct).subscribe((res) => {
            this.service.getAllCustomers();
            this.editClicked = false;
            this.route.navigate(['../'], { relativeTo: this.activatedRoute });
        }, (err) => {
        });
    }

    addProduct() {
        this.newProductList.push({ isActive: true } as MProducts);
    }

    isProductExist(name) {
        this.service.isProductExist(name).subscribe((res) => {
            // if (res === true) {

            //     this.notification.error('Product Already Exist in List !!!');
            //     this.isFormTouched = false;
            // } else {
            //     this.isFormTouched = true;
            // }

        },
            (err) => {
            });
    }

    editClickHandler(product, index) {
        if (product) {
            this.editClicked.fill(false);
            this.editClicked[index] = true;
        }
    }



    formTouchHandler() {
        this.isFormTouched = true;
    }


}
