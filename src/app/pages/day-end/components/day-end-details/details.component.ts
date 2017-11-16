import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { User } from '../../../user-management/user-management.interface';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TripProduct } from '../../dayend.interfaces';
import { Route } from '@angular/router/src/config';
import { environment } from '../../../../../environments/environment';

@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    logedInUser: User;
    tripId: number;
    tripData: any = {};
    ticketDetails: any;
    disabled: boolean = false;
    unitReconciliation: any[] = [];
    driverDetails: any = [];
    productList: any = [];
    isNewlyAdded: boolean = false;
    newlyAddedProduct: any = [];
    selectedProduct: object;
    isDistributorExist: boolean;
    userSubTitle: string = '';
    userRoleId: number; 

    totalUnit: any = {
        TotalLoad: 0,
        TotalLoadActual: 0,
        TotalReturn: 0,
        TotalReturnActual: 0,
        TotalTruckDamage: 0,
        TotalTruckDamageActual: 0,
        TotalCustomerDamage: 0,
        TotalCustomerDamageActual: 0,
        TotalManualTickets: 0,
        TotalSale: 0,
        TotalOverShort: 0
    };

    ticketTotal: any = {
        invoiceTotal: 0,
        receivedTotal: 0
    };


    constructor(
        private service: DayEndService,
        private route: ActivatedRoute,
        private userService: UserService,
        private notification: NotificationsService,
        private modalService: NgbModal,
        protected router:Router,
    ) { }

    tripStatus(statusCode) {
        let statusText = 'Draft';
        switch (statusCode) {
            case 23:
                statusText = "Draft";
                break;
            case 24:
                statusText = "Submitted";
                break;
            case 25:
                statusText = "Approved";
                break;
            default:
                statusText = statusCode;
        }
        return statusText;
    }

    ngOnInit() {
        const userId = localStorage.getItem('userId') || '';
        this.userService.getUserDetails(userId).subscribe((response) => {
            this.userRoleId = response.Role.RoleID;
            this.isDistributorExist = response.IsDistributor;
            this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + response.Distributor.DistributorName : '';
        });

        this.logedInUser = this.userService.getUser();
        this.tripId = +this.route.snapshot.params['tripId'];

        this.loadTripData();

        this.loadTripDetailByDate();



        this.loadUnitReconciliation();
    }

    loadTripData() {
        this.service.getTripDetails(this.tripId).subscribe((res) => {
            this.driverDetails = res = res || [];
        });
    }

    loadTripDetailByDate() {
        this.service.getTripDetailByDate(this.tripId).subscribe((res) => {
            this.ticketDetails = res;
            this.tripData = res.Tripdetail[0];
            this.tripData.TripTicketList.forEach(ticket => {
                ticket.TicketNumber = +ticket.TicketNumber;
                ticket.Customer = { CustomerName: ticket.CustomerName, CustomerID: ticket.CustomerID, CustomerType: ticket.CustomerType };
            });
            this.calculateTotalTicketAmount();
        }, (err) => {

        });
    }

    sortByWordLength = (a: any) => {
        return a.location.length;
    }

    loadUnitReconciliation() {
        this.service.getUnitsReconciliation(this.tripId).subscribe((res) => {
            if (Array.isArray(res)) {
                this.unitReconciliation = res;
                this.unitReconciliation.forEach(element => {
                    element['Load1Quantity'] = element['Load1Quantity'] || element['Load'];
                    element['ReturnQuantity'] = element['ReturnQuantity'] || element['Returns'];
                    element['DamageQuantity'] = element['DamageQuantity'] || element['TruckDamage'];
                    element['CustomerDamageDRV'] = element['CustomerDamageDRV'] || element['CustomerDamage'];
                    this.unitReconChange(element);
                });
            }
            this.loadProduct();
            this.calculateTotalUnitReconcilation();
        }, (err) => {
            console.log(err);
        });
    }

    unitReconChange(item) {
        item.OverShort = (item.ReturnQuantity + item.DamageQuantity + item.CustomerDamageDRV + item.ManualTicket + item.Sale) - item.Load1Quantity;
        this.calculateTotalUnitReconcilation();
    }

    saveReconciliation(statusId) {

        console.log(this.newlyAddedProduct);
        // return false;
        const total = this.ticketDetails.Total;
        const cashRecon = {
            TripID: this.tripId,
            ActualCash: total.actualdepositcash,
            ActualCheck: total.actualdepositcheck,
            ActualCoin: total.ActualCoin,
            Misc: total.Misc,
            TripStatusID: statusId,
        };
        this.service.saveRecociliation(cashRecon).subscribe((res) => {
            //  this.notification.success("Success", res);
            if(this.userRoleId ===3){
                if(statusId === 25){
                    this.notification.success("Success", "Trip has been approved successfully.");
                    this.router.navigate(['/pages/day-end/list']);
                } 
            }
        }, (err) => {
            err = JSON.parse(err._body);
            this.notification.error("Error", err.Message);
        });
        if(this.userRoleId !==3) {
            this.service.saveUnitReconciliation(this.unitReconciliation.concat(this.newlyAddedProduct)).subscribe((res) => {

                this.notification.success("Success", res);
                if(statusId === 25){
                    this.router.navigate(['/pages/day-end/list']);
                } else {
                    this.tripData.TripStatusID = statusId;
                }
            }, (err) => {
                err = JSON.parse(err._body);
                this.notification.error("Error", err.Message);
            });
        }
    }

    submitApproveReconciliation() {
        this.saveReconciliation(24);
    }

    addProductRow() {
        this.isNewlyAdded = true;
        if (!this.newlyAddedProduct) { return; }
        this.newlyAddedProduct.push({} as TripProduct);
    }

    loadProduct() {
        this.service.getProductList().subscribe((res) => {
            // Filterout already listed products
            this.productList = res.filter((product) => {
                return this.unitReconciliation.findIndex(pr => pr.ProductID === product.ProductID) < 0;
            });
        }, (err) => {

        });
    }

    // intializing other manadatory field = 0 which are not taken as input. 
    resetField(index) {
        this.newlyAddedProduct[index].CustomerDamage = 0;
        this.newlyAddedProduct[index].DamageQuantity = 0;
        this.newlyAddedProduct[index].Load = 0;
        this.newlyAddedProduct[index].LoadReturnDamageID = 0;
        this.newlyAddedProduct[index].ManualLoad = 0;
        this.newlyAddedProduct[index].ManualTicket = 0;
        this.newlyAddedProduct[index].OverShort = 0;
        this.newlyAddedProduct[index].Returns = 0,
            this.newlyAddedProduct[index].Sale = 0;
        this.newlyAddedProduct[index].TruckDamage = 0;
        this.newlyAddedProduct[index].TripID = this.tripId;
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
        this.resetField(arrayIndex);
    }

    // remove newly added product from Array
    removeProduct(index) {
        this.newlyAddedProduct.splice(index, 1);
    }

    // Calclation total unit reconciliation 
    calculateTotalUnitReconcilation() {
        const u = this.totalUnit;
        u.TotalLoad = u.TotalLoadActual = u.TotalReturn = u.TotalReturnActual = u.TotalTruckDamage = u.TotalTruckDamageActual = u.TotalCustomerDamage = u.TotalCustomerDamageActual = u.TotalManualTickets = u.TotalSale = u.TotalOverShort = 0;
        this.unitReconciliation.concat(this.newlyAddedProduct).forEach(u => {
            this.totalUnit.TotalLoad += +u.Load;
            this.totalUnit.TotalLoadActual += +u.Load1Quantity || 0;
            this.totalUnit.TotalReturn += +u.Returns;
            this.totalUnit.TotalReturnActual += +u.ReturnQuantity || 0;
            this.totalUnit.TotalTruckDamage += +u.TruckDamage;
            this.totalUnit.TotalTruckDamageActual += +u.DamageQuantity || 0;
            this.totalUnit.TotalCustomerDamage += +u.CustomerDamage;
            this.totalUnit.TotalCustomerDamageActual += +u.CustomerDamageDRV || 0;
            this.totalUnit.TotalManualTickets += +u.ManualTicket;
            this.totalUnit.TotalSale += +u.Sale;
            this.totalUnit.TotalOverShort += +u.OverShort;
        });
    }

    //
    calculateTotalTicketAmount() {
        this.ticketTotal.invoiceTotal = this.ticketTotal.receivedTotal = 0;
        this.tripData.TripTicketList.forEach(t => {
            this.ticketTotal.invoiceTotal += t.IsSaleTicket ? t.TotalSale : -t.TotalSale;
            if (t.IsSaleTicket) {
                this.ticketTotal.receivedTotal += (!t.CheckAmount && !t.CashAmount) ? t.TotalSale : t.CheckAmount + t.CashAmount;
            }
        });
    }
    viewTicket(ticketID) {
        if (ticketID) {
            window.open(environment.reportEndpoint + "?Rtype=TK&TicketID=" + ticketID, "Ticket", "width=560,height=700,resizable=yes,scrollbars=1");
        } else {
            this.notification.error("Ticket preview unavailable!!");
        }

    }
}

