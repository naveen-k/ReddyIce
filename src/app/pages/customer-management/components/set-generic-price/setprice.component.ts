import { NotificationsService } from 'angular2-notifications';
import { MProducts, MapProducts } from '../../../../shared/interfaces/interfaces';
import { CustomerManagementService } from '../../customer-management.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/user.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
    templateUrl: './setprice.component.html',
    styleUrls: ['./setprice.component.scss'],
})

export class SetPriceComponent implements OnInit {
    rightCardOpen: boolean = false;
    externalProducts: any = [];
    newProductList: any = [];
    isProductAlreadyExist: boolean = false;
    editClicked: any = [];
    isFormTouched: boolean = false;
    formIsDirty: boolean = false;
    isDistributorExist: boolean;
    userSubTitle: string = '';
    showSpinner: boolean = false;
    counter: number = 0;
    isNewProduct: boolean = false;
    hideColumn: boolean = false;
    newProduct: any = {};
    action: string = '';
    cardTitle: string;
    productType: any = 'all';
    extProducts: any = [];


    constructor(
        protected service: CustomerManagementService,
        public activatedRoute: ActivatedRoute,
        protected route: Router,
        protected notification: NotificationsService,
        protected userService: UserService,
        private modalService: NgbModal,
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
            this.extProducts = res;
            this.showSpinner = false;
            this.editClicked = new Array(this.externalProducts.length);
            this.editClicked.fill(false);
            this.updateProductOnTypeChange();
        }, (err) => {
        });
    }

    setGenericPrice() {

        this.isFormTouched = false;
        const priceProduct = { 'SetGenricPrice': this.externalProducts, 'AddNewExternalProduct': this.newProductList }
        this.service.setGenericPrice(priceProduct).subscribe((res) => {
            this.service.getAllCustomers();
            this.notification.success(res);
            this.getExternalProducts();
            for (let i = 0; i < this.counter; i = i + 1) {
                this.newProductList.pop({ isActive: true } as MProducts);
            }
            this.editClicked = false;
        }, (err) => {
            this.isFormTouched = true;
        });
    }

    addProduct() {
        this.newProductList.push({ isActive: true } as MProducts);
        this.counter = this.counter + 1;
    }

    editClickHandler(product, index) {
        if (product) {
            this.editClicked.fill(false);
            this.editClicked[index] = true;
            this.isFormTouched = false;
        }
    }



    formTouchHandler() {
        this.isFormTouched = false;
    }


    closeRightCard() {
        if (this.formIsDirty) {
            const activeModal = this.modalService.open(ModalComponent, {
                size: 'sm',
                backdrop: 'static',
            });
            activeModal.componentInstance.BUTTONS.OK = 'Discard';
            activeModal.componentInstance.showCancel = true;
            activeModal.componentInstance.modalHeader = 'Warning!';
            activeModal.componentInstance.modalContent = `You have unsaved changes, do you want to discard?`;
            activeModal.componentInstance.closeModalHandler = (() => {
                this.rightCardOpen = !this.rightCardOpen;
                this.isNewProduct = false;
                this.hideColumn = !this.hideColumn;
                this.formIsDirty = false;
                this.isFormTouched = false;
            });

        } else {
            this.rightCardOpen = !this.rightCardOpen;
            this.isNewProduct = false;
            this.isFormTouched = false;
            this.hideColumn = !this.hideColumn;
        }
    }

    formChangedHandler() {
        this.formIsDirty = true;
        this.isFormTouched = false;
    }
    showNewProduct(newProduct) {
        this.formIsDirty = false;
        this.action = 'create';
        this.rightCardOpen = !this.rightCardOpen;
        this.isNewProduct = true;
        this.hideColumn = !this.hideColumn;
        this.cardTitle = 'Create New Product';
        this.newProduct = <MapProducts>{
            ProductName: '',
            ProductPrice: 0,
        };
    }

    onSaveProduct(product) {
        if (product) {
            product.IsActive = true;
            let tempProd: MapProducts[] = [];
            tempProd.push(product);
            const priceProduct = { 'AddNewExternalProduct': tempProd };
            this.service.setGenericPrice(priceProduct).subscribe((res) => {
                this.rightCardOpen = !this.rightCardOpen;
                this.hideColumn = !this.hideColumn;
                this.isNewProduct = false;
                this.formIsDirty = false;
                this.service.getAllCustomers();
                this.notification.success(res);
                this.getExternalProducts();
                this.productType = 'all';
            }, (err) => {
                this.notification.error(err);
            });
        }
    }
    onUpdateProduct(product) {
        if (product) {
            console.log("product ", product);
            product.IsActive = true;
            let tempProd: MapProducts[] = [];
            tempProd.push(product);
            const priceProduct = { 'SetGenricPrice': tempProd };
            this.service.setGenericPrice(priceProduct).subscribe((res) => {
                this.rightCardOpen = !this.rightCardOpen;
                this.hideColumn = !this.hideColumn;
                this.isNewProduct = false;
                this.formIsDirty = false;
                this.service.getAllCustomers();
                this.notification.success(res);
                this.getExternalProducts();
                this.productType = 'all';
            }, (err) => {
                this.notification.error(err);
            });
        }
    }
    onEditClicked(product) {
        this.action = 'edit';
        this.newProduct = Object.assign({}, product);
        this.cardTitle = 'Edit Product Price';
        this.isNewProduct = false;
        this.formIsDirty = false;
        if (!this.rightCardOpen) {
            this.rightCardOpen = !this.rightCardOpen;
            this.hideColumn = !this.hideColumn;

        }

    }

    deleteProduct(productID, status) {
        const activeModal = this.modalService.open(ModalComponent, {
            size: 'sm',
            backdrop: 'static',
        });
        activeModal.componentInstance.BUTTONS.OK = 'OK';
        activeModal.componentInstance.showCancel = true;
        activeModal.componentInstance.modalHeader = 'Warning!';
        activeModal.componentInstance.modalContent = `This Product may possibly mapped to a customer,Are you sure you still want to inactive the product?`;
        activeModal.componentInstance.closeModalHandler = (() => {
            this.service.deleteProduct(productID, status).subscribe((res) => {
                this.notification.success('Product got Inactive Successfully!!!');
                this.getExternalProducts();
            }, (err) => {
                this.notification.error('Problem Deleting Product!!!');
            });

        });
    }

    reActivateProduct(productID, status) {
        const activeModal = this.modalService.open(ModalComponent, {
            size: 'sm',
            backdrop: 'static',
        });
        activeModal.componentInstance.BUTTONS.OK = 'OK';
        activeModal.componentInstance.showCancel = true;
        activeModal.componentInstance.modalHeader = 'Warning!';
        activeModal.componentInstance.modalContent = `Are you sure you want to Re-active the product?`;
        activeModal.componentInstance.closeModalHandler = (() => {
            this.service.deleteProduct(productID, status).subscribe((res) => {
                this.notification.success('Product got Re-active Successfully!!!');
                this.getExternalProducts();
            }, (err) => {
                this.notification.error('Problem Reactivating Product!!!');
            });

        });
    }

    updateProductOnTypeChange() {
        this.extProducts = this.externalProducts.filter((p) => {
            if (this.productType === 'active') {
                return p.IsActive;
            } else if (this.productType === 'inActive') {
                return !p.IsActive;
            }
            return true;
        });
    }

}
