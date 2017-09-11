import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {

    private linkRpt: SafeResourceUrl;
    
    constructor(private sanitizer: DomSanitizer) {
    this.linkRpt = sanitizer.bypassSecurityTrustResourceUrl("http://mobiledev/Dashboard/Pages/ReportViewer.aspx?/DashboardReports/RouteSettlementReport&rc:Parameters=false&DeliveryDate=09/07/2017&BranchCode=311&RouteNumber=810&DriverID=12990&routeID=1208&LocationID=578&BranchID=1362&TripCode=1&DistributormasterID=0");    
    } 
}
