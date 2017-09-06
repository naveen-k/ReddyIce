import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    subParams: any;
    tripID: any;
    tripData: any = {};
    total:any={
        overShort:0.0,
        totalDeposit:0.0
    }

    unitReconciliation1: any;
    ticketDetails: any;
    Actual: any;
    Coins: any;
    Cash: any;
    Misc: any;
    tripDate: any = '2017-08-31';
    unitReconciliation: any = [];
    reconciliationDTO:any={
        TripID: 0,
        ActualCash: 0.0,
        ActualCheck: 0.0,
        ActulaCoin: 0.0,
        Tolls: 0.0,
        Misc: 0.0,
        TtripStatusID: 1.0
      };

    driverDetails: any = [];
    constructor(private service: DayEndService, private route: ActivatedRoute,
         private userService: UserService,private notification:NotificationsService) {
        this.unitReconciliation1 = service.dataTableData2;
        //this.ticketDetails = service.dataTableData3;

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
            this.unitReconciliation = res;
        }, (err) => {
            console.log(err);
        });
    }
    saveReconciliation(){
       
        this.reconciliationDTO.TripID=this.tripID;
        this.reconciliationDTO.ActualCash=this.Cash;
        this.reconciliationDTO.ActualCheck=this.Actual;
        this.reconciliationDTO.ActualCoin=this.Coins;
        this.reconciliationDTO.Misc=this.Misc;
        console.log(this.reconciliationDTO);
        this.service.saveRecociliation(this.reconciliationDTO).subscribe((res)=>{
            this.notification.success("Success",res);
        },(err)=> {
            err=JSON.parse(err._body);
            this.notification.error("Error",err.Message);
        });
    }
}

