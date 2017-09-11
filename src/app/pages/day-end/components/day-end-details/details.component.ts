import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { CreateTicketComponent } from '../../../manual-tickets/create-ticket/create-ticket.component';

@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    subParams: any;
    tripID: any;
    tripData: any = {};
    total: any = {
        overShort: 0.0,
        totalDeposit: 0.0
    }
    ticketDetails: any;
    Actual: any;
    Coins: any;
    Cash: any;
    Misc: any;
    disabled:boolean = false;
    tripDate: any = '2017-08-31';
    unitReconciliation: any = [];
    logedInUser:any = {};
    loadReturnDto:any = [];
    reconciliationDTO: any = {
        TripID: 0,
        ActualCash: 0.0,
        ActualCheck: 0.0,
        ActulaCoin: 0.0,
        Tolls: 0.0,
        Misc: 0.0,
        TripStatusID: 1.0
    };


    driverDetails: any = [];
    constructor(private service: DayEndService, private route: ActivatedRoute,
        private userService: UserService, private notification: NotificationsService,
        private modalService: NgbModal) {
             this.logedInUser = this.userService.getUser();
    }
    openCreateTicketModal() {

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
        this.tripData = this.service.gettripData();
        console.log(this.tripData);

        this.subParams = this.route
            .queryParams
            .subscribe(params => {
                // Defaults to 0 if no query param provided.
                this.tripID = params['TripID'];
                console.log(this.tripID);
                this.getLoadReturn();
                this.service.getTripDetails(this.tripID).subscribe((res) => {
                    console.log(res);
                    this.driverDetails = res;
                }, (err) => {
                    console.log(err);
                });
            });

        this.tripDate = this.tripData.Created.split('T')[0];
        this.reconciliationDTO.TripStatusID = this.tripData.TripStatusID;
        if(this.tripData.TripStatusID == 24 || this.tripData.TripStatusID == 25) { this.disabled = true; };
       console.log(this.disabled);
        this.service.getTripDetailByDate(this.tripID, this.tripDate).subscribe((res) => {
            this.ticketDetails = res;
            console.log(res);
        }, (err) => {

        });
    }

    sortByWordLength = (a: any) => {
        return a.location.length;
    }
    doAddition() {
        this.total.totalDeposit = parseFloat(this.Actual ? this.Actual : 0) + parseFloat(this.Coins ? this.Coins : 0)
            + parseFloat(this.Cash ? this.Cash : 0) + parseFloat(this.Misc ? this.Misc : 0);
        this.total.overShort = parseFloat(this.total.totalDeposit) - parseFloat(this.ticketDetails.Total.TotalCheck)
            + parseFloat(this.ticketDetails.Total.TotalCash);
        return this.total;
        //return this.totalDeposit;
    }
    getLoadReturn() {
        this.service.getUnitsReconciliation(this.tripID).subscribe((res) => {
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
            // this.mapUnitReconData(res);
        }, (err) => {
            console.log(err);
        });
    }

    unitReconChange(item) {
        item.OverShort = item.Load1Quantity - (item.ReturnQuantity + item.DamageQuantity + item.CustomerDamageDRV + item.ManualTicket + item.Sale);

    }

    saveReconciliation() {

        this.reconciliationDTO.TripID = this.tripID;
        this.reconciliationDTO.ActualCash = this.Cash;
        this.reconciliationDTO.ActualCheck = this.Actual;
        this.reconciliationDTO.ActualCoin = this.Coins;
        this.reconciliationDTO.Misc = this.Misc;
        console.log(this.reconciliationDTO);
        this.service.saveRecociliation(this.reconciliationDTO).subscribe((res) => {
            this.notification.success("Success", res);
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
         console.log(this.unitReconciliation);
         
    }
}

