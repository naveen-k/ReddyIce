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
    activatedRouteObject: any;
    checkValidity = false;
    hideAddProduct = false;
    back: string;
    showSpinner: boolean = false;
    constructor(
        private service: LoadService,
        private route: ActivatedRoute,
        private userService: UserService,
        private notification: NotificationsService,
        private modalService: NgbModal,
        protected router: Router,
    ) { 
        
    }


    ngOnInit() {
        this.getFilters(function(){
            if (!this.filter || !this.filter.userBranch || !this.filter.userDriver || !this.filter.selectedDate) {
                this.router.navigate(['/pages/load/list']);
            } else {
                const userId = localStorage.getItem('userId') || '';
                this.userService.getUserDetails(userId).subscribe((response) => {
                    this.userRoleId = response.Role.RoleID;
                });
    
                this.logedInUser = this.userService.getUser();
    
                this.deliveryDate = this.service.formatDate(this.filter.selectedDate);
                this.currentTripCode = this.filter.tripCode;
                this.loadId = this.filter.LoadID;//+this.route.snapshot.params['loadId'];
                this.activatedRouteObject = this.route.snapshot.data;
                this.loadProduct();
                if (this.activatedRouteObject['LoadMode']) {
                    this.showSpinner = true;
                    this.loadLoadsDetails();
                    this.checkValidity = true;
                } else {
                    this.currentTripCode = this.filter.tripCode + 1;
                }
                this.populateLoadData();
            }
        });//this.service.getFilter();
        
    }
    populateLoadData() {
        this.loadData.BranchID = this.filter.userBranch;
        this.loadData.DriverID = this.filter.userDriver;
        this.loadData.DeliveryDate = this.deliveryDate;
        this.loadData.TripCode = this.currentTripCode;
    }
    loadLoadsDetails() {
        this.service.getLoadDetails(this.loadId).subscribe((res) => {
            res = res || [];
            this.loadList = res.LoadDetails;
            this.loadList = this.loadList.map(item => {
                return Object.assign({
                    disabled: {
                        Load1: item.Load1 == null ? false : true,
                        Load2: item.Load2 == null ? false : true,
                        Load3: item.Load3 == null ? false : true,
                        Load4: item.Load4 == null ? false : true
                    }
                }, item);
            });
            this.loadData.PalletsIssued = res.PalletsIssued;
            this.loadData.TruckNumber = res.TruckNumber;
            this.currentTripCode = res.TripCode;
            this.loadData.TripStatus = res.TripStatus;
            this.loadLoadData();
            this.showSpinner = false;
        });
    }
    loadLoadData() {

        this.loadProduct();

    }
    removeProduct(index) {
        let filter= this.newlyAddedProduct.filter((item,i)=>i != index);
        this.newlyAddedProduct=filter;
        let count=0;
        if(this.newlyAddedProduct.length > 0){
            this.newlyAddedProduct.map(item=>{
                if(Object.keys(item).length <=0 ){
                    count+=1;
                }
            });
        }
        this.hideAddProduct = count > 0 ? true : false;
        (this.loadList.length <=0 && this.newlyAddedProduct.length <=0) && (this.checkValidity = false);
    }
    addProductRow() {
        this.isNewlyAdded = true;
        this.hideAddProduct = true;
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
            //product.ProductID = '';
            this.newlyAddedProduct[arrayIndex]={};
            const activeModal = this.modalService.open(ModalComponent, {
                size: 'sm',
                backdrop: 'static',
            });
            activeModal.componentInstance.BUTTONS.OK = 'OK';
            //activeModal.componentInstance.showCancel = true;
            activeModal.componentInstance.modalHeader = 'Warning!';
            activeModal.componentInstance.modalContent = `Product already selected. You cannot select same product again. If product is duplicate then you cannot submit`;
            activeModal.componentInstance.closeModalHandler = (() => {
                this.hideAddProduct = true;
            });
           // setTimeout(() => {
            //    this.newlyAddedProduct.splice(arrayIndex, 1, {})
           // })

            return;
        }
        products[0]['ProductSourceID'] = this.productList.filter((o) => o.ProductID === products[0]['ProductID'])[0]['ProductSourceID']; // .indexOf(product.ProductID);
        //this.newlyAddedProduct[arrayIndex] = productIndex; // this.productList[productIndex].ProductID;
        this.checkValidity = true;
        this.hideAddProduct = false;
        //this.resetField(arrayIndex);
    }
    saveLoad() {
        this.checkValidity = false;

        if (!this.activatedRouteObject['LoadMode']) {
            this.loadData.loaddetails = this.newlyAddedProduct;
            this.service.createLoadData(this.loadData).subscribe((res) => {
                this.notification.success("Success", "Load created successfully");
                this.router.navigate(['/pages/load/list']);
            }, (err) => {
                this.checkValidity = true;
                let error = JSON.parse(err._body);console.log(err,'err');
                let custom_error = err.status == 406 && error.Message ? `Trip is already closed till Trip # ${parseInt(error.Message)}. Now load will create for Trip # ${parseInt(error.Message)+1} just click on Submit.` : error.Message;
                let custom_error_msg = err.status == 406 && error.Message ? "Notification" : "Error"
                this.notification.error(custom_error_msg, custom_error);
                if(err.status == 406 && error.Message && error.Message != null && error.Message != ""){
                    let count=parseInt(error.Message)+1;
                    this.currentTripCode = count;
                    this.loadData.TripCode = count;
                    this.filter.TripCode = count;
                }
            });
        } else {
            let newLoadList = this.loadList.concat(this.newlyAddedProduct);
            this.loadData.loaddetails = newLoadList;
            this.service.saveLoadDetails(this.loadId, this.loadData).subscribe((res) => {
                this.notification.success("Success", "Load updated successfully");
                this.router.navigate(['/pages/load/list']);
            }, (err) => {
                this.checkValidity = true;
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
                        this.loadData.TripStatus = load.TripStatus;
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
    backToList() {
        this.showSpinner = true;
        this.router.navigate(['/pages/load/list']);
    }
    getFilters(callback){
        this.filter = JSON.parse(sessionStorage.getItem("LoadFilter"));
        callback.call(this);
    }
}

