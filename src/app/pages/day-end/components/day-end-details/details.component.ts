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
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { CurrencyFormatter } from 'app/shared/pipes/currency-pipe';

@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    providers: [NgbTabset,CurrencyFormatter]
})
export class DetailsComponent implements OnInit {
    activeTab: string = 'details';
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
        TotalGoodReturns: 0,
        TotalSale: 0,
        TotalOverShort: 0,
        TotalSaleCredits: 0
    };

    ticketTotal: any = {
        invoiceTotal: 0,
        receivedTotal: 0,
        totalCash: 0,
        totalCheck: 0,
        totalCharge: 0,
        totalDrayage: 0,
        totalBuyBack: 0,
        totalDistAmt: 0
    };


    constructor(
        private service: DayEndService,
        private route: ActivatedRoute,
        private userService: UserService,
        private notification: NotificationsService,
        private modalService: NgbModal,
        protected router: Router,
        public tabset: NgbTabset,
        private currencyFormatter: CurrencyFormatter
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
        this.logedInUser = this.userService.getUser();
        this.userRoleId = this.logedInUser.Role.RoleID;
        this.isDistributorExist = this.logedInUser.IsDistributor;
        this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + this.logedInUser.Distributor.DistributorName : '';

        this.tripId = +this.route.snapshot.params['tripId'];
        this.loadTripData();
        this.loadTripDetailByDate();
    }



    loadTripData() {
        this.service.getTripDetails(this.tripId).subscribe((res) => {
            this.driverDetails = res = res || [];
        });
    }
    //total : any;
    loadTripDetailByDate() {
        this.service.getTripDetailByDate(this.tripId).subscribe((res) => {
            this.loadUnitReconciliation();
            this.ticketDetails = res;
            this.tripData = res.Tripdetail[0];
            this.tripData.TripTicketList.forEach(ticket => {
                ticket.TicketNumber = +ticket.TicketNumber;
                ticket.Customer = { CustomerName: ticket.CustomerName, CustomerID: ticket.CustomerID, CustomerType: ticket.CustomerType };
                ticket.ticketType = this.service.getTicketType(ticket.IsSaleTicket, ticket.Customer, ticket.TicketTypeID);
                ticket.amount = +ticket.TotalSale.fpArithmetic("+", +ticket.TaxAmount || 0);
                var cardAmount = (this.tripData.IsClosed) ? ticket.CreditCardAmount : 0;
                // ticket.checkCashAmount = (ticket.TicketTypeID === 30) ? 0 : ticket.CheckAmount + ticket.CashAmount + cardAmount;
                if (ticket.TicketTypeID === 30) {
                    ticket.checkCashAmount = 0;
                } else {
                    ticket.checkCashAmount = +ticket.CheckAmount.fpArithmetic("+", +ticket.CashAmount || 0);
                    ticket.checkCashAmount = +ticket.checkCashAmount.fpArithmetic("+", +cardAmount || 0);
                }
                //ticket.amount = (ticket.IsClosed)?ticket.amount + (ticket.checkCashAmount - ticket.amount):ticket.amount;
                if (ticket.TicketTypeID === 30) { return; }
                ticket.ChargeAmount = (ticket.checkCashAmount === 0 && ticket.PaymentTypeID === 19) ? ticket.amount : (ticket.ChargeAmount) || 0;
                // this.ticketTotal.invoiceTotal += ticket.TicketTypeID !== 27 ? (ticket.amount) : (ticket.amount) || 0;

                this.ticketTotal.invoiceTotal = +this.ticketTotal.invoiceTotal.fpArithmetic("+", ticket.amount || 0)
                this.ticketTotal.totalCash += ticket.CashAmount || 0;
                this.ticketTotal.totalCheck += ticket.CheckAmount || 0;
                this.ticketTotal.totalCharge += ticket.ChargeAmount || 0;
                this.ticketTotal.totalDrayage += ticket.Drayage || 0;
                this.ticketTotal.totalBuyBack += ticket.BuyBack || 0;
                this.ticketTotal.totalDistAmt += ticket.DistAmt || 0;
                // this.ticketTotal.receivedTotal += ticket.checkCashAmount || 0;
                this.ticketTotal.receivedTotal = +this.ticketTotal.receivedTotal.fpArithmetic("+", ticket.checkCashAmount || 0)
                this.cashReconciliationTotal(ticket);
            });
            //this.calculateTotalTicketAmount();
            this.cashReconciliationSubTotal();
            this.cashReconChange(this.ticketDetails);
        }, (err) => {

        });
    }
    TotalCashReconciliation: any = {
        TotalManualSale: 0,
        TotalManualCash: 0,
        TotalManualCheck: 0,
        TotalManualCreditCard: 0,
        TotalManualCharge: 0,
        TotalHHSale: 0,
        TotalHHCash: 0,
        TotalHHCheck: 0,
        TotalHHCreditCard: 0,
        TotalHHCharge: 0,
        TotalManualCashCustomer: 0,
        TotalHHCashCustomer: 0,
        TotalManualChargeCustomer: 0,
        TotalHHChargeCustomer: 0

    };
    cashReconciliationTotal(ticket) {
        if (ticket.TicketTypeID === 30) { return; }
        if (ticket.IsPaperTicket) {
            this.TotalCashReconciliation.TotalManualSale += ticket.TicketTypeID !== 27 ? (ticket.TotalSale + ticket.TaxAmount) : (ticket.TotalSale + ticket.TaxAmount) || 0;
            this.TotalCashReconciliation.TotalManualCash += ticket.CashAmount || 0;
            this.TotalCashReconciliation.TotalManualCheck += ticket.CheckAmount || 0;
            this.TotalCashReconciliation.TotalManualCreditCard += ticket.CreditCardAmount || 0;
            this.TotalCashReconciliation.TotalManualCharge += ((((+ticket.CashAmount) + (+ticket.CheckAmount)) == 0) ? ticket.ChargeAmount : 0) || 0;
            if (ticket.PaymentTypeID === 18) { this.TotalCashReconciliation.TotalManualCashCustomer += ticket.TicketTypeID !== 27 ? (ticket.amount) : (ticket.amount) || 0; }
            if (ticket.PaymentTypeID === 19) { this.TotalCashReconciliation.TotalManualChargeCustomer += ticket.TicketTypeID !== 27 ? (ticket.amount) : (ticket.amount) || 0; }
        } else {
            this.TotalCashReconciliation.TotalHHSale += ticket.TicketTypeID !== 27 ? (ticket.amount) : (ticket.amount) || 0;
            this.TotalCashReconciliation.TotalHHCash += ticket.CashAmount || 0;
            this.TotalCashReconciliation.TotalHHCheck += ticket.CheckAmount || 0;
            this.TotalCashReconciliation.TotalHHCreditCard += ticket.CreditCardAmount || 0;
            this.TotalCashReconciliation.TotalHHCharge += ((((+ticket.CashAmount) + (+ticket.CheckAmount)) == 0) ? ticket.ChargeAmount : 0) || 0;
            if (ticket.PaymentTypeID === 18) { this.TotalCashReconciliation.TotalHHCashCustomer += ticket.TicketTypeID !== 27 ? (ticket.amount) : (ticket.amount) || 0; }
            if (ticket.PaymentTypeID === 19) { this.TotalCashReconciliation.TotalHHChargeCustomer += ticket.TicketTypeID !== 27 ? (ticket.amount) : (ticket.amount) || 0; }
        }
    }
    cashReconciliationSubTotal() {
        this.ticketDetails.Total.TotalManualSale = this.TotalCashReconciliation.TotalManualSale;
        this.ticketDetails.Total.TotalManualCash = this.TotalCashReconciliation.TotalManualCash;
        this.ticketDetails.Total.TotalManualCheck = this.TotalCashReconciliation.TotalManualCheck;
        this.ticketDetails.Total.TotalManualCreditCard = (this.tripData.IsClosed) ? this.TotalCashReconciliation.TotalManualCreditCard : 0.00;
        this.ticketDetails.Total.TotalManualCharge = this.TotalCashReconciliation.TotalManualCharge;
        this.ticketDetails.Total.TotalHHSale = this.TotalCashReconciliation.TotalHHSale
        this.ticketDetails.Total.TotalHHCash = this.TotalCashReconciliation.TotalHHCash
        this.ticketDetails.Total.TotalHHCheck = this.TotalCashReconciliation.TotalHHCheck
        this.ticketDetails.Total.TotalHHCreditCard = (this.tripData.IsClosed) ? this.TotalCashReconciliation.TotalHHCreditCard : 0.00;
        this.ticketDetails.Total.TotalHHCharge = this.TotalCashReconciliation.TotalHHCharge;
        // this.ticketDetails.Total.TotalPreDiposit = (+this.ticketDetails.Total.actualdepositcash || 0) + (+this.ticketDetails.Total.actualdepositcheck || 0) + (+this.ticketDetails.Total.ActualCoin || 0);
        this.ticketDetails.Total.TotalPreDiposit = (+this.ticketDetails.Total.actualdepositcash || 0).fpArithmetic("+", +this.ticketDetails.Total.actualdepositcheck || 0);
        this.ticketDetails.Total.TotalPreDiposit = (+this.ticketDetails.Total.TotalPreDiposit || 0).fpArithmetic("+", +this.ticketDetails.Total.ActualCoin || 0);
        this.ticketDetails.Total.actualdepositcash = (this.ticketDetails.Total.actualdepositcash === null) ? `0.00` : this.ticketDetails.Total.actualdepositcash.toString().indexOf('.') < 0 ? `${this.ticketDetails.Total.actualdepositcash}.00` : this.ticketDetails.Total.actualdepositcash;
        this.ticketDetails.Total.actualdepositcheck = (this.ticketDetails.Total.actualdepositcheck === null) ? `0.00` : this.ticketDetails.Total.actualdepositcheck.toString().indexOf('.') < 0 ? `${this.ticketDetails.Total.actualdepositcheck}.00` : this.ticketDetails.Total.actualdepositcheck;
        this.ticketDetails.Total.ActualCoin = (this.ticketDetails.Total.ActualCoin === null) ? `0.00` : this.ticketDetails.Total.ActualCoin.toString().indexOf('.') < 0 ? `${this.ticketDetails.Total.ActualCoin}.00` : this.ticketDetails.Total.ActualCoin;
        this.ticketDetails.Total.Misc = (this.ticketDetails.Total.Misc === null) ? `0.00` : this.ticketDetails.Total.Misc.toString().indexOf('.') < 0 ? `${this.ticketDetails.Total.Misc}.00` : this.ticketDetails.Total.Misc;
        var CTotal = this.ticketDetails.Total.TotalManualCreditCard + this.ticketDetails.Total.TotalHHCreditCard;
        this.ticketDetails.Total.CreditCardAmountTotal = (CTotal === null) ? `0.00` : CTotal.toString().indexOf('.') < 0 ? `${CTotal}.00` : CTotal;
        // this.ticketDetails.Total.TotalCashCustomer = this.TotalCashReconciliation.TotalManualCashCustomer + this.TotalCashReconciliation.TotalHHCashCustomer;
        // this.ticketDetails.Total.TotalChargeCustomer = this.TotalCashReconciliation.TotalManualChargeCustomer + this.TotalCashReconciliation.TotalHHChargeCustomer;
        this.ticketDetails.Total.TotalCashCustomer = (+this.TotalCashReconciliation.TotalManualCashCustomer || 0).fpArithmetic("+", +this.TotalCashReconciliation.TotalHHCashCustomer || 0);
        this.ticketDetails.Total.TotalChargeCustomer = (+this.TotalCashReconciliation.TotalManualChargeCustomer || 0).fpArithmetic("+", +this.TotalCashReconciliation.TotalHHChargeCustomer || 0);
        this.ticketDetails.Total.totalSales = (+this.ticketDetails.Total.TotalCashCustomer || 0).fpArithmetic("+", +this.ticketDetails.Total.TotalChargeCustomer || 0);
        this.ticketDetails.Total.Tolls = (this.ticketDetails.Total.Tolls === undefined || this.ticketDetails.Total.Tolls === null || this.ticketDetails.Total.Tolls === 0) ? `0.00` : this.ticketDetails.Total.Tolls.toString().indexOf('.') < 0 ? `${this.ticketDetails.Total.Tolls}.00` : this.ticketDetails.Total.Tolls;
        this.ticketDetails.Total.MoneyOrderFee = (this.ticketDetails.Total.MoneyOrderFee === undefined || this.ticketDetails.Total.MoneyOrderFee === null || this.ticketDetails.Total.MoneyOrderFee === 0) ? `0.00` : this.ticketDetails.Total.MoneyOrderFee.toString().indexOf('.') < 0 ? `${this.ticketDetails.Total.MoneyOrderFee}.00` : this.ticketDetails.Total.MoneyOrderFee;
        this.ticketDetails.Total.MCHHC = +this.ticketDetails.Total.TotalManualCheck.fpArithmetic("+", this.ticketDetails.Total.TotalHHCheck || 0);
        this.ticketDetails.Total.MCHHCash = +this.ticketDetails.Total.TotalManualCash.fpArithmetic("+", this.ticketDetails.Total.TotalHHCash || 0);
        this.ticketDetails.Total.MCCHHC = +this.ticketDetails.Total.TotalManualCreditCard.fpArithmetic("+", this.ticketDetails.Total.TotalHHCreditCard || 0);
        this.ticketDetails.Total.CCC = this.ticketDetails.Total.MCHHCash + this.ticketDetails.Total.MCHHC + this.ticketDetails.Total.MCCHHC;
    }
    sortByWordLength = (a: any) => {
        return a.location.length;
    }

    loadUnitReconciliation() {
        this.service.getUnitsReconciliation(this.tripId).subscribe((res) => {
            if (Array.isArray(res)) {
                this.unitReconciliation = res;
                this.unitReconciliation.forEach(element => {
                    element['Load1Quantity'] = element['Load1Quantity'];// ? element['Load1Quantity'] : (this.tripData.IsSeasonal ? element['Load1Quantity'] : element['Load']);
                    element['ReturnQuantity'] = element['ReturnQuantity'];// ? element['ReturnQuantity'] : (this.tripData.IsSeasonal ? element['ReturnQuantity'] : element['Returns']);
                    element['DamageQuantity'] = element['DamageQuantity'];// ? element['DamageQuantity'] : (this.tripData.IsSeasonal ? element['DamageQuantity'] : element['TruckDamage']);
                    element['CustomerDamageDRV'] = element['CustomerDamageDRV'];// ? element['CustomerDamageDRV'] : (this.tripData.IsSeasonal ? element['CustomerDamageDRV'] : element['CustomerDamage']);
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
        let totalInv = (+item.Load + +item.Returns - +item.TruckDamage);
        //item.OverShort = (+item.ReturnQuantity + +item.DamageQuantity + +item.CustomerDamageDRV + +item.ManualTicket + +item.Sale + +item.GoodReturns) - (+item.Load1Quantity);
        item.OverShort = +item.Sale - +item.SaleReturnQty + +item.ManualTicket - +totalInv + +item.GoodReturns + +item.CustomerDamage;// -((+item.ReturnQuantity + +item.DamageQuantity + +item.CustomerDamageDRV + +item.ManualTicket + +item.Sale) - (+item.Load1Quantity + +item.GoodReturns + + item.SaleReturnQty));
        this.calculateTotalUnitReconcilation();
    }

    totalDeposit: any = 0;
    totalOverShort: any = 0;
    cashReconChange(ticketDetails) {
        if (ticketDetails) {
            this.totalDeposit = (+ticketDetails.Total.actualdepositcash || 0)
                .fpArithmetic("+", (+ticketDetails.Total.actualdepositcheck || 0))
                .fpArithmetic("+", (+ticketDetails.Total.Misc || 0))
                .fpArithmetic("+", (+ticketDetails.Total.TotalHHCreditCard || 0))
                .fpArithmetic("+", (+ticketDetails.Total.TotalManualCreditCard))
                .fpArithmetic("+", (+ticketDetails.Total.ActualCoin || 0))
                .fpArithmetic("+", (+ticketDetails.Total.Tolls || 0))
                .fpArithmetic("+", (+ticketDetails.Total.MoneyOrderFee || 0));

            this.totalOverShort = (+this.totalDeposit || 0).fpArithmetic("-", (+ticketDetails.Total.MCHHC || 0).fpArithmetic("+", +ticketDetails.Total.MCHHCash || 0).fpArithmetic("+", +ticketDetails.Total.MCCHHC || 0));
            ticketDetails.Total.TotalPreDiposit = (+ticketDetails.Total.actualdepositcash || 0).fpArithmetic("+", +ticketDetails.Total.actualdepositcheck || 0).fpArithmetic("+", +ticketDetails.Total.ActualCoin || 0);
        }
    }
    approveTrip(status) {
        const activeModal = this.modalService.open(ModalComponent, {
            size: 'sm',
            backdrop: 'static',
        });
        activeModal.componentInstance.BUTTONS.OK = 'OK';
        activeModal.componentInstance.showCancel = true;
        activeModal.componentInstance.modalHeader = 'Warning!';
        activeModal.componentInstance.modalContent = `Once you will approve the trip, you will not be able to edit Cash Reconcilation.`;
        activeModal.componentInstance.closeModalHandler = (() => {
            this.saveReconciliation(status);
        });

    }

    handlerUnitReconSubmit() {
        const activeModal = this.modalService.open(ModalComponent, {
            size: 'sm',
            backdrop: 'static',
        });
        activeModal.componentInstance.BUTTONS.OK = 'OK';
        activeModal.componentInstance.showCancel = true;
        activeModal.componentInstance.modalHeader = 'Warning!';
        activeModal.componentInstance.modalContent = `Once you submit the Unit Reconciliation, you will not be able to edit Unit Reconcilation`;
        activeModal.componentInstance.closeModalHandler = (() => {
            this.unitReconcileSubmit();
        });
    }

    unitReconcileSubmit() {
        let objToSave = {
            TripId: this.tripId,
            PalletLoadQuantity: this.tripData.PalletLoadQuantity,
            PalletReturnQuantity: this.tripData.PalletReturnQuantity,
            LoadReturnDamageModel: this.unitReconciliation.concat(this.newlyAddedProduct)
        }
        this.service.saveUnitReconciliation(objToSave).subscribe((res) => {
            this.notification.success("Success", "Trip details updated successfully");
            this.tripData.UnitApprovedBy = 1; // Alok - Hack for enabling Approve Button and hiding Submit button
        }, (err) => {
            err = JSON.parse(err._body);
            this.notification.error("Error", err.Message);
        });
    }

    saveReconciliation(statusId) {
        const total = this.ticketDetails.Total;
        const cashRecon = {
            TripID: this.tripId,
            ActualCash: total.actualdepositcash,
            ActualCheck: total.actualdepositcheck,
            ActualCoin: total.ActualCoin,
            Misc: total.Misc,
            TripStatusID: statusId,
            Comments: total.Comments,
            Tolls: total.Tolls,
            MoneyOrderFee: total.MoneyOrderFee,
        };
        this.service.saveRecociliation(cashRecon).subscribe((res) => {
            if (statusId === 25) {
                this.notification.success("Success", "Trip has been approved successfully");
                this.router.navigate(['/pages/day-end/list']);
            }
        }, (err) => {
            err = JSON.parse(err._body);
            this.notification.error("Error", err.Message);
        });
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
        u.TotalLoad = u.TotalLoadActual = u.TotalReturn = u.TotalReturnActual = u.TotalTruckDamage = u.TotalTruckDamageActual = u.TotalCustomerDamage = u.TotalCustomerDamageActual = u.TotalManualTickets = u.TotalSale = u.TotalOverShort = u.TotalSaleCredits = u.TotalGoodReturns = 0;
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
            this.totalUnit.TotalGoodReturns += +u.GoodReturns || 0;
            this.totalUnit.TotalSale += +u.Sale;
            if (u.SaleReturnQty) {
                this.totalUnit.TotalSaleCredits += +u.SaleReturnQty;
            }
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
    onTabChange(event) {
        this.activeTab = event.nextId;
    }
    popupWin: any;
    printReconciliation() {
        let printContents, printContentsHead, tabName='';
        //printContentsHead = document.getElementById('day-end-list-head').innerHTML;
        let mainData = '';//window.document.getElementById('cashContainer').innerHTML;
        mainData += this.printHeaderData();
        if (this.activeTab == 'details') {
            mainData = this.printDetailData();
            tabName = 'Ticket Details'
        } else if (this.activeTab == 'unit') {
            mainData = this.printUnitData();
            tabName = 'Units Reconciliation'
        } else if (this.activeTab == 'cash') {
            mainData = this.printCashData();
            tabName = 'Cash Reconciliation'
        }
        if (this.popupWin) { this.popupWin.close(); }
        setTimeout(() => {
            this.popupWin = window.open('', '_new', 'top=0,left=0,height="100",width="100%",fullscreen="yes"');
            this.popupWin.document.open();
            this.popupWin.document.write(`
          <html>
            <head>
              <title>Trip Details(${tabName})</title>
              <style>
              //........Customized style.......
              </style>
            </head>
            <body onload="window.print();window.close();">${mainData}</body>
          </html>`
            );
            this.popupWin.document.close();
        }, 1000);
    }
    currencyTransform(value) {
        return this.currencyFormatter.transform(value)
    }
    printCashData() {
        let table = `
            <div class="row page-header">
            <div class="col-sm-1"></div>
            <div class="col-sm-10" style="overflow-x:auto;" id="cashContainer">
                <table cellpadding="5" border=1 style="border-collapse: collapse;" class="table table-condensed table-bordered cash-table">
                    <thead class="tableHeader">
                        <th></th>
                        <th>Total Sale</th>
                        <th>Cash</th>
                        <th>Check</th>
                        <th>Credit Card</th>
                        <th>Charge</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Manual Tickets</td>
                            <td class="text-align-right">${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalManualSale)}</td>
                            <td class="text-align-right">${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalManualCash)}</td>
                            <td class="text-align-right">${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalManualCheck)}</td>
                            <td class="text-align-right">${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalManualCreditCard)}</td>
                            <td class="text-align-right">${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalManualCharge)}</td>
                        </tr>
                        <tr>
                            <td>HH Tickets</td>
                            <td class="text-align-right">${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalHHSale)}</td>
                            <td class="text-align-right">${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalHHCash)}</td>
                            <td class="text-align-right">${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalHHCheck)}</td>
                            <td class="text-align-right">${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalHHCreditCard)}</td>
                            <td class="text-align-right">${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalHHCharge)}</td>
                        </tr>
                        <tr>
                            <td><b>Total</b></td>
                            <td class="text-align-right"><b>${this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalManualSale + this.ticketDetails.Total.TotalHHSale)}</b></td>
                            <td class="text-align-right"><b>${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.MCHHCash)}</b></td>
                            <td class="text-align-right"><b>${this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.MCHHC)}</b></td>
                            <td class="text-align-right"><b>${this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.MCCHHC)}</b></td>
                            <td class="text-align-right"><b>${this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalManualCharge + this.ticketDetails.Total.TotalHHCharge)}</b></td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <div class="col-sm-1"></div>
            </div>
            <div style="width: 100%; margin-top: 10px;">
                <div style="width: 64%; float: left; margin-top: 10px;">
                    <div style="width: 100%; float: left">
                        <table cellpadding="5" width="38%" border="1" style="border-collapse: collapse;float:left">
                            <thead>
                            <th colspan="2">Payment</th>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Cash</td><td><span>${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.MCHHCash) }</span></td>
                            </tr>
                                <td>Check</td><td><span>${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.MCHHC)}</span></td>
                            </tr>
                            <tr>
                                <td>Credit Card</td><td><span>${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.MCCHHC)}</span></td>
                            </tr>
                            <tr>
                                <td><b>Total Payment</b></td><td><span><b>${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.CCC)}</b></span></td>
                            </tr>
                            </tbody>
                        </table>

                        <table cellpadding="5" border="1" width="58%" style="border-collapse: collapse;float:left; margin-left: 10px;">
                            <thead>
                            <th colspan="2">Sales</th>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Cash</td><td><span> ${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalCashCustomer)} </span></td>
                            </tr>
                                <td>Charge</td><td><span>${ this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalChargeCustomer)}</span></td>
                            </tr>
                            <tr>
                                <td><b>Total Sale</b></td><td><span><b>${this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.totalSales)}</b></span></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>            
                    <div style="width: 100%; float: left; margin-top: 10px;">
                        <table cellpadding="5" width="38%" border=1 style="border-collapse: collapse;float:left">
                            <thead>
                            <th colspan="2">Comment</th>
                            </thead>
                            <tbody>
                            <tr>
                                <td colspan="2"><textarea rows="7" style="width:100%;border:0px;resize: none;" ${((this.userRoleId==3 && !this.logedInUser.IsChecker) || this.tripData.TripStatusID == 25 || !this.tripData.IsClosed || (this.userRoleId==2 && this.logedInUser.IsSeasonal)) ? 'disabled' : ''}>${this.ticketDetails ? (this.ticketDetails.Total.Comments!= null ? this.ticketDetails.Total.Comments : '' ) : ''}</textarea></td>
                            </tr>
                            </tbody>
                        </table>     
                        
                        <table cellpadding="5" border="1" width="58%" style="border-collapse: collapse;float:left; margin-left: 10px;">
                            <thead>
                            <th colspan="4">HH Record Deposit</th>
                            </thead>
                            <tbody>
                            <tr>
                                <td style="width:25%">Cash($)</td>
                                <td style="width:25%">
                                    <input type="text" value="${this.ticketDetails ? this.ticketDetails.Total.HHCashRecived : ''}" min="0" disabled placeholder="0.00" style="width:98%">
                                </td>
                                <td style="width:25%">Misc($)</td>
                                <td style="width:25%">
                                    <input type="text" value="${this.ticketDetails ? this.ticketDetails.Total.HHMiscExpense : ''}" min="0" disabled placeholder="0.00" style="width:98%">
                                </td>
                            </tr>
                            <tr>
                                <td style="width:25%">Check($)</td>
                                <td style="width:25%">
                                    <input type="text" value="${this.ticketDetails ? this.ticketDetails.Total.HHCheckReceived : ''}" min="0" disabled placeholder="0.00" style="width:98%">                    
                                </td>
                                <td style="width:25%">Deposited($)</td>
                                <td style="width:25%">
                                    <input type="text" value="${this.ticketDetails ? this.ticketDetails.Total.HHAmountDeposited : ''}" min="0" disabled placeholder="0.00" style="width:98%">                    
                                </td>                    
                            </tr>
                            </tbody>
                        </table>   
                    </div>
                </div>
                <div style="width: 34%; float: left; margin-top: 10px;">    
                    <table cellpadding="5" border=1 style="border-collapse: collapse;">
                        <thead>
                        <th colspan="2">Actual Deposit</th>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Checks/Money Orders($)</td>
                            <td>
                                <input type="text" value="${this.ticketDetails.Total.actualdepositcheck}"
                                min="0" ${((this.userRoleId==3 && !this.logedInUser.IsChecker) || this.tripData.TripStatusID == 25 || !this.tripData.IsClosed || (this.userRoleId==2 && this.logedInUser.IsSeasonal)) ? 'disabled' : ''} placeholder="0.00">
                            </td>
                        </tr>
                        <tr>
                            <td>Cash($) </td>
                            <td>
                                <input type="text" value="${this.ticketDetails ? this.ticketDetails.Total.actualdepositcash : ''}" (ngModelChange)="cashReconChange(ticketDetails)"
                                min="0" ${((this.userRoleId==3 && !this.logedInUser.IsChecker) || this.tripData.TripStatusID == 25 || !this.tripData.IsClosed || (this.userRoleId==2 && this.logedInUser.IsSeasonal)) ? 'disabled' : ''} placeholder="0.00">
                            </td>                  
                        </tr>
                        <tr>
                            <td>Coins($)</td>
                            <td>
                                <input type="text" value="${this.ticketDetails.Total.ActualCoin}"
                                min="0" ${((this.userRoleId==3 && !this.logedInUser.IsChecker) || this.tripData.TripStatusID == 25 || !this.tripData.IsClosed || (this.userRoleId==2 && this.logedInUser.IsSeasonal)) ? 'disabled' : ''} placeholder="0.00">     
                            </td>                  
                        </tr>
                        <tr>
                            <td>Total Deposit</td>
                            <td>
                                ${this.ticketDetails && this.currencyTransform(this.ticketDetails.Total.TotalPreDiposit)}                    
                            </td>                  
                        </tr>   
                        <tr>
                            <td>Credit Card($)</td>
                            <td>
                                <input type="text" min="0" value="${this.ticketDetails.Total.CreditCardAmountTotal}" disabled placeholder="0.00"> 
                            </td>                  
                        </tr>
                        <tr>
                            <td>Tolls($)</td>
                            <td>
                                <input type="text" min="0" value="${this.ticketDetails.Total.Tolls}"
                                ${((this.userRoleId==3 && !this.logedInUser.IsChecker) || this.tripData.TripStatusID == 25 || !this.tripData.IsClosed || (this.userRoleId==2 && this.logedInUser.IsSeasonal))} placeholder="0.00">   
                            </td>                  
                        </tr>
                        <tr>
                            <td>Money Order Fee($)</td>
                            <td>
                                <input type="text" min="0" value="${this.ticketDetails.Total.MoneyOrderFee}"
                                ${((this.userRoleId==3 && !this.logedInUser.IsChecker) || this.tripData.TripStatusID == 25 || !this.tripData.IsClosed || (this.userRoleId==2 && this.logedInUser.IsSeasonal))? 'disabled' : ''}  placeholder="0.00">
                            </td>                  
                        </tr>
                        <tr>
                            <td>Misc($)</td>
                            <td>
                                <input type="text" value='${this.ticketDetails.Total.Misc}'
                                min="0" ${((this.userRoleId==3 && !this.logedInUser.IsChecker) || this.tripData.TripStatusID == 25 || !this.tripData.IsClosed || (this.userRoleId==2 && this.logedInUser.IsSeasonal))} placeholder="0.00"> 
                            </td>                  
                        </tr>
                        <tr>
                            <td>Total Deposit & Other</td>
                            <td>
                                <span>
                                <b>${this.currencyTransform(this.totalDeposit)}</b>
                                </span>
                            </td>                  
                        </tr>
                        <tr>
                            <td>Over/Short</td>
                            <td>
                                <span>
                                <b>${ this.currencyTransform(this.totalOverShort)}</b>
                                </span>   
                            </td>                  
                        </tr>                               
                        </tbody>
                    </table> 
                </div>
            </div>
        </div>            
        `;
        return table;
    }
    printUnitData() {
        let table = '';
        return table;
    }
    printDetailData() {
        let table = '';
        return table;
    }
    printHeaderData() {
        let table = '';
        return table;
    }
}

