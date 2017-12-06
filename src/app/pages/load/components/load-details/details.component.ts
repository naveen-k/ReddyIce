import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { User } from '../../../user-management/user-management.interface';
import { LoadService } from '../../load.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadModel } from '../../load.interfaces';
import { Route } from '@angular/router/src/config';
import { environment } from '../../../../../environments/environment';
import { debug } from 'util';

@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    filter: any = {};
    logedInUser: User;
    userRoleId:number;
    loadData: any = {};
    productList: any = [];
    loadId:number;
    isNewlyAdded: boolean = false;
    newlyAddedProduct: any = [];
    loadDetails:any = [];
    loadList: any[] = [];
    constructor(
        private service: LoadService,
        private route: ActivatedRoute,
        private userService: UserService,
        private notification: NotificationsService,
        private modalService: NgbModal,
        protected router: Router,
    ) { }


    ngOnInit() {
        const userId = localStorage.getItem('userId') || '';
        this.userService.getUserDetails(userId).subscribe((response) => {
            this.userRoleId = response.Role.RoleID;
        });

        this.logedInUser = this.userService.getUser();
        this.filter = this.service.getFilter();
        debugger;
        this.loadId = +this.route.snapshot.params['loadId'];
        this.loadLoadData();
        this.loadLoadsDetails();
    }
    loadLoadsDetails() {
        this.service.getLoads(this.filter.selectedDate,this.filter.userBranch,this.filter.userDriver,false).subscribe((res) => {
            this.loadList = res = res || [];
            this.loadLoadData();
        });
    }
    loadLoadData() {

                this.loadList.forEach(element => {
                    element['Load1Quantity'] = element['Load1Quantity'] || element['Load'];
                    element['ReturnQuantity'] = element['ReturnQuantity'] || element['Returns'];
                    element['DamageQuantity'] = element['DamageQuantity'] || element['TruckDamage'];
                    element['CustomerDamageDRV'] = element['CustomerDamageDRV'] || element['CustomerDamage'];
                });
                this.loadProduct();
           
    }
    addProductRow() {
        this.isNewlyAdded = true;
        if (!this.newlyAddedProduct) { return; }
        this.newlyAddedProduct.push({} as LoadModel);
    }

    loadProduct() {
        this.service.getProductList(this.filter.userBranch).subscribe((res) => {
            // Filterout already listed products
           /* this.productList = res.filter((product) => {
                return this.loadList.findIndex(pr => pr.ProductID === product.ProductID) < 0;
            });*/
            this.productList = res;
        }, (err) => {

        });
    }
    productChangeHandler(product: any, arrayIndex: any): void {
        const products = this.newlyAddedProduct.filter(t => t.ProductID === product.ProductID);
        if (products.length === 2) {
            // product.ProductID = '';
            const activeModal = this.modalService.open(ModalComponent, {
                size: 'sm',
                backdrop: 'static',
            });
            activeModal.componentInstance.BUTTONS.OK = 'OK';
            // activeModal.componentInstance.showCancel = true;
            activeModal.componentInstance.modalHeader = 'Warning!';
            activeModal.componentInstance.modalContent = `Product already selected! You cannot select same product again.`;
            activeModal.componentInstance.closeModalHandler = (() => {
            });
            setTimeout(() => {
                this.newlyAddedProduct.splice(arrayIndex, 1, {})
            })

            return;
        }
        const productIndex = this.productList.filter((o) => o.ProductID === product.ProductID)[0]; // .indexOf(product.ProductID);
        this.newlyAddedProduct[arrayIndex] = productIndex; // this.productList[productIndex].ProductID;
        //this.resetField(arrayIndex);
    }

   
}

