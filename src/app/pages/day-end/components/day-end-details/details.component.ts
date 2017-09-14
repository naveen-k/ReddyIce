import { User } from '../../../user-management/user-management.interface';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TripProduct } from '../../dayend.interfaces';

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
    unitReconciliation: any = [];
    driverDetails: any = [];
    productList: any = [];

    constructor(
        private service: DayEndService,
        private route: ActivatedRoute,
        private userService: UserService,
        private notification: NotificationsService,
        private modalService: NgbModal,
    ) { }

    openCreateTicketModal(ticket) {
        // TODO open create ticket modal
    }

    tripStatus(statusCode) {
        let statusText = '';
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
        this.logedInUser = this.userService.getUser();
        this.tripId = +this.route.snapshot.params['tripId'];

        this.tripData = this.service.getTripData();

        this.loadTripData();

        this.loadTripDetailByDate();
        
        this.loadProduct();

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
        }, (err) => {

        });
    }

    sortByWordLength = (a: any) => {
        return a.location.length;
    }
    loadProduct() {
        this.service.getProductList().subscribe((res) => {
            this.productList = res;
            console.log(res);
        }, (err) => {

        });
    }
    productChangeHandler(item) {
     // item.ProductName = 
    }
    loadUnitReconciliation() {
        this.service.getUnitsReconciliation(this.tripId).subscribe((res) => {
            console.log(res);
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
        }, (err) => {
            console.log(err);
        });
    }

    unitReconChange(item) {
        item.OverShort = (item.ReturnQuantity + item.DamageQuantity + item.CustomerDamageDRV + item.ManualTicket + item.Sale) - item.Load1Quantity;
    }

    saveReconciliation() {
        const total = this.ticketDetails.Total;
        const cashRecon = {
            TripID: this.tripId,
            ActualCash: total.actualdepositcash,
            ActualCheck: total.actualdepositcheck,
            ActualCoin: total.actualdepositcoin,
            Misc: total.actualdepositmisc,
        };

        this.service.saveRecociliation(cashRecon).subscribe((res) => {
            //  this.notification.success("Success", res);
        }, (err) => {
            err = JSON.parse(err._body);
            this.notification.error("Error", err.Message);
        });

        this.service.saveUnitReconciliation(this.unitReconciliation).subscribe((res) => {
            this.notification.success("Success", res);
        }, (err) => {
            err = JSON.parse(err._body);
            this.notification.error("Error", err.Message);
        });
        // console.log(this.unitReconciliation);

    }
     addProductRow() {
    if (!this.unitReconciliation) { return; }
    this.unitReconciliation.push({} as TripProduct);
  }
}

