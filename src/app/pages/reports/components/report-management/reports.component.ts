import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../../../shared/user.service';
import { environment } from '../../../../../environments/environment';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {

    linkRpt: SafeResourceUrl;
    selectedReport: any;
    displayName: any;
    url: any;
    date: any;
    date1:any;
    driverID: any = '10-Jasons634';
    location: any = "578";
    user: any = "10";
    tripcode: any = "1";
    viewReport: boolean = false;
    value: any = "578";
    value1: any = "10";
    value2: any = "1";
    sHeight: any = 340;
    isDistributorExist: boolean;
    userSubTitle: string = '';
    todaysDate: any;
    isRIFlag: boolean = true;
    isDistributorFlag: boolean = false;

    constructor(private sanitizer: DomSanitizer, protected userService: UserService) {
        /* window.onload = (e) =>
         {
             ngZone.run(() => {
                 
                 this.sHeight = window.innerHeight - (document.getElementById("r1").offsetHeight + document.getElementById("r0").offsetHeight + 100);
             });
         };
         window.onresize = (e) =>
         {
             ngZone.run(() => {
                
                 this.sHeight = window.innerHeight - (document.getElementById("r1").offsetHeight + document.getElementById("r0").offsetHeight + 100);
             });
         };*/
    }
    ngOnInit() {
        const now = new Date();
        this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        const userId = localStorage.getItem('userId') || '';
        this.userService.getUserDetails(userId).subscribe((response) => {
            this.isDistributorExist = response.IsDistributor;
            this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + response.Distributor.DistributorName : '';
        });
    }
    change(value) {
        if (value) {
            this.displayName = value;
        }
    }

    locationfunc(value) {
        this.location = value;
    }
    tripcodefunc(value2) {
        this.tripcode = value2;
    }
    User(value1) {
        this.user = value1;
    }

    updateLink() {
        this.viewReport = true;
        // console.log(this.displayName, "this.location ", this.location);
        this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
            (environment.reportEndpoint+'?Rtype='
            + this.displayName + '&DeliveryDate=' + this.formatDate(this.date) + '&BranchCode=311&RouteNumber=801&DriverID='
            + this.user + '&routeID=1208&LocationID=' + this.location + '&BranchID=1362&TripCode=' + this.tripcode + '&DistributormasterID=0');
    }

    formatDate(date) {
        if (!date.year) { return '' };
        let yy = date.year, mm = date.month, dd = date.day;
        if (mm < 10) { mm = '0' + mm }
        if (dd < 10) { dd = '0' + dd }
        return mm + '/' + dd + '/' + yy;


    }

    IsRI() {
        this.isRIFlag = true;
        this.isDistributorFlag = false;
    }
    IsDistriButor() {
        this.isRIFlag = false;
        this.isDistributorFlag = true;
    }
}
