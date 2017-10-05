import { User } from '../../../user-management/user-management.interface';
import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../../../shared/user.service';
import { ReportService } from '../../reports.service';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {

    filter: any = {
        startDate: null,
        endDate: null,
        reportType: null,
        ticketType: null,
        userType: 'internal',
        distributor: null,
        branch: null,
        internalDriver: null,
        distDriver: null,
        driver:null,
    };

    user: User;

    linkRpt: SafeResourceUrl;
    
    distributors: any = [];
    branches: any = [];
    drivers: any = [];
    driversofDist: any = [];
    
    viewReport: boolean = false;
    RI:boolean=false;
    isPaperTicket:boolean=false;
    userSubTitle: string = '';
    
    constructor(private sanitizer: DomSanitizer, protected userService: UserService, protected reportService: ReportService) {
    }
    ngOnInit() {
        const now = new Date();
        this.filter.startDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.endDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

        this.user = this.userService.getUser();
        this.userSubTitle = this.user.IsDistributor ? this.user.Distributor.DistributorName : '';

        this.getAllBranches();
    }

    getAllBranches() {
        this.reportService.getBranches().subscribe((res) => {
            this.branches = res;
            this.branches.shift();
        }, (err) => { });
    }

    getDistributors() {
        this.reportService.getDistributors().subscribe((res) => {
            this.distributors = res;
        }, (err) => { });
    }

    userTypeChangeHandler() {
        if (this.filter.userType === 'internal') {
            this.RI=true;
            this.getAllBranches();
        } else {
            this.RI=false;
            this.getDistributors();
        }
    }
    ticketTypeChangeHandler(){
        if(this.filter.ticketType === 'paper'){
            this.isPaperTicket=true;
        }else{
            this.isPaperTicket = false;
        }
    }
    updateLink() {
        debugger
        this.viewReport = true;
        this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl(`http://frozen.reddyice.com/NewDashboardReport/Reports/ReportData.aspx?Rtype=${this.filter.reportType}&StartDate=this.formatDate(${this.filter.startDate})&EndDate=this.formatDate(${this.filter.endDate})&IsPaperTicket=${this.isPaperTicket}&IsRI=${this.RI}&BranchID=${this.filter.branch}&DistributoID=${this.filter.distributor}&DriverID=${this.filter.driver}`);
        // console.log(this.displayName, "this.location ", this.location);
        // this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
        //     (`${environment.reportEndpoint}?Rtype=${this.filter.reportType}
        // &DeliveryDate=${this.formatDate(this.filter.startDate)}&BranchCode=${this.filter.branch}&DriverID=${this.filter.internalDriver}`)
        // this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
        //     (environment.reportEndpoint + '?Rtype='
        //     + this.displayName + '&DeliveryDate=' + this.formatDate(this.startLatestDate) + '&BranchCode=311&RouteNumber=801&DriverID='
        //     + this.user + '&routeID=1208&LocationID=' + this.location + '&BranchID=1362&TripCode=' + this.tripcode + '&DistributormasterID=0');
    }

    formatDate(startLatestDate) {
        if (!startLatestDate.year) { return ''; }
        let yy = startLatestDate.year, mm = startLatestDate.month, dd = startLatestDate.day;
        if (mm < 10) { mm = '0' + mm }
        if (dd < 10) { dd = '0' + dd }
        return mm + '/' + dd + '/' + yy;
    }

    branchChangeHandler() {
        this.reportService.getDriversbyBranch(this.filter.branch).subscribe((res) => {
            this.drivers = res;
        }, (err) => { });
    }
    distributorChangeHandler() {
        this.reportService.getDriversbyDistributors(this.filter.distributor).subscribe((res) => {
            this.driversofDist = res;
        }, (err) => {

        });
    }
}
