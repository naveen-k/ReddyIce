
import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {

    linkRpt: SafeResourceUrl;
    selectedReport: any;
    displayName: any;
    url: any;
    date: any;
    driverID: any = '10-Jasons634';
    location: any;
    user: any;
    tripcode: any;
    viewReport:boolean=false;
    value:any;
    value1:any;
    value2:any;



    constructor(private sanitizer: DomSanitizer) {

    }

    change(value) {
        if (value) {
            if (value == 'Delivery Status') {
                this.displayName = 'DR';
            } else if (value == 'End of Day Report') {
                this.displayName = 'ED';
            } else {
                return false;
            }
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
        this.viewReport=true;
        console.log(this.displayName);
        this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
            ('http://frozen.reddyice.com/DashboardReports/Reports/ReportData.aspx?Rtype='
            + this.displayName + '&DeliveryDate='+this.formatDate(this.date)+'&BranchCode=311&RouteNumber=801&DriverID='
            + this.user+ '&routeID=1208&LocationID='+this.location+'&BranchID=1362&TripCode='+this.tripcode+'&DistributormasterID=0');
    }

    formatDate(date) {
        if (!date.year) { return '' };
        let yy = date.year, mm = date.month, dd = date.day;
        if (mm < 10) { mm = '0' + mm }
        if (dd < 10) { dd = '0' + dd }
        return mm + '/' + dd + '/' + yy;
    

    }
}
