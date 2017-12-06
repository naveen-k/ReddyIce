import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { User } from '../../../user-management/user-management.interface';
import { LoadService } from '../../load.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadModel, LoadProduct } from '../../load.interfaces';
import { Route } from '@angular/router/src/config';
import { environment } from '../../../../../environments/environment';
import { debug } from 'util';

@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    filter: any = {};
    loads: any = {};
    logedInUser: User;
    userRoleId: number;
    loadData: any = {};
    productList: any = [];
    loadId: number;
    isNewlyAdded: boolean = false;
    newlyAddedProduct: any = [];
    loadDetails: any[] = [];
    loadList: any[] = [];
    deliveryDate: any = '';
    currentTripCode: number = 0;
    activatedRouteObject :any;
    constructor(
        private service: LoadService,
        private route: ActivatedRoute,
        private userService: UserService,
        private notification: NotificationsService,
        private modalService: NgbModal,
        protected router: Router,
    ) { }


    ngOnInit() {
        this.filter = this.service.getFilter();
        if(!this.filter.userBranch || !this.filter.userDriver || !this.filter.selectedDate){
            this.router.navigate(['/pages/load/list']);
        } else {
            const userId = localStorage.getItem('userId') || '';
            this.userService.getUserDetails(userId).subscribe((response) => {
                this.userRoleId = response.Role.RoleID;
            });
    
            this.logedInUser = this.userService.getUser();
           
            this.deliveryDate = this.service.formatDate(this.filter.selectedDate);
            this.currentTripCode = this.filter.tripCode;
            this.loadId = +this.route.snapshot.params['loadId'];
            this.activatedRouteObject = this.route.snapshot.data;
            this.loadProduct();
            if (this.activatedRouteObject['LoadMode']) {
                this.getLoads(this.loadId);
    
            } else {
                this.currentTripCode = this.filter.tripCode + 1;
            }
            this.populateLoadData();
        }
        

    }
    populateLoadData() {
        this.loadData.BranchID = this.filter.userBranch;
        this.loadData.DriverID = this.filter.userDriver;
        this.loadData.DeliveryDate = this.deliveryDate;
        this.loadData.TripCode = this.currentTripCode;
    }
    loadLoadsDetails() {
        this.service.getLoadDetails(this.loadId).subscribe((res) => {
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
        this.newlyAddedProduct.push({} as LoadProduct);
    }

    loadProduct() {
        this.service.getProductList(this.filter.userBranch).subscribe((res) => {
            // Filterout already listed products
             this.productList = res.filter((product) => {
                 return this.loadList.findIndex(pr => pr.ProductID === product.ProductID) < 0;
             });
            //this.productList = res;
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
    saveLoad() {
        
        if (!this.activatedRouteObject['LoadMode']) {
            this.loadData.loaddetails = this.newlyAddedProduct;
            this.service.createLoadData(this.loadData).subscribe((res) => {

                this.notification.success("Success", "Load created successfully");
                this.router.navigate(['/pages/load/list']);
                console.log(this.loadData);
            }, (err) => {
                err = JSON.parse(err._body);
                this.notification.error("Error", err.Message);
            });
        } else {
            let newLoadList = this.loadList.concat(this.newlyAddedProduct);
            this.loadData.loaddetails = newLoadList;
            this.service.saveLoadDetails(this.loadId,this.loadData).subscribe((res) => {
                
                this.notification.success("Success", "Load updated successfully");
                this.router.navigate(['/pages/load/list']);
                console.log(this.loadData);
            }, (err) => {
                err = JSON.parse(err._body);
                this.notification.error("Error", err.Message);
            });
        }

    }
    resetField(index) {
        this.newlyAddedProduct[index].ProductID = 0;
        this.newlyAddedProduct[index].Load1 = '';
        this.newlyAddedProduct[index].Load2 = '';
        this.newlyAddedProduct[index].Load3 = '';
        this.newlyAddedProduct[index].Load4 = '';
    }
    getLoads(loadId) {
        this.service.getLoads(this.service.formatDate(this.filter.selectedDate), null, null, false).subscribe((res) => {
            this.loads = res;
            if (typeof this.loads === 'object' && this.loads && this.loads.length && this.loads.length > 0 && this.filter.userBranch && this.filter.userDriver) {
                this.loads.forEach((load) => {
                    if (this.filter.userBranch === load.BranchID && this.filter.userDriver === load.DriverID && load.LoadID === loadId) {
                        this.loadData.PalletsIssued = load.PalletsIssued;
                        this.loadData.TruckNumber = load.TruckNumber;
                        this.currentTripCode = load.TripCode;
                    }
                });
                this.loadLoadsDetails();
            }
        },
            (error) => {

                if (error) {

                    this.notification.error('', 'Something went wrong while fetching data');
                }
            }
        );
    }
}

