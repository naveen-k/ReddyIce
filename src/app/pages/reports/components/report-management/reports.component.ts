import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../user-management/user-management.interface';
import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../../../shared/user.service';
import { ReportService } from '../../reports.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {

    filter: any = {
        startDate: null,
        endDate: null,
        reportType: 'SR',
        ticketType: 'regular',
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
    
    constructor(
        private sanitizer: DomSanitizer, 
        protected userService: UserService, 
        protected reportService: ReportService,
        protected modalService: NgbModal,
        protected notification: NotificationsService
    ) {}
    ngOnInit() {
        const now = new Date();
        this.filter.startDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.endDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

        this.user = this.userService.getUser();
        this.userSubTitle = this.user.IsDistributor ? this.user.Distributor.DistributorName : '';

        // to select Distributor radio button by default if logged in with distributor
        if (this.user.IsDistributor) {
            this.filter.userType = 'external';
        }

        this.getAllBranches();
    }

    getAllBranches() {
        this.reportService.getBranches().subscribe((res) => {
            this.branches = res;
            // this.branches.shift();
            this.sortBranches();
        }, (err) => { });
    }

    sortBranches() {
        // sort by name
        this.branches.sort(function (a, b) {
            const nameA = a.BranchCode;
            const nameB = b.BranchCode;
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });
    }

    getDistributors() {
        this.reportService.getDistributors().subscribe((res) => {
            this.distributors = res;
        }, (err) => { });
    }

    userTypeChangeHandler() {
        if (this.filter.userType === 'internal') {            
            this.getAllBranches();
        } else {
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
        this.viewReport = true;
        // hack to check if start date is not greater than end date
        if ((Date.parse(this.formatDate(this.filter.endDate)) <= Date.parse(this.formatDate(this.filter.startDate)))) {
            this.notification.error('Start Date cannot be greater than End Date!!!');
            this.viewReport = false;
        }
        this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
        (`http://frozen.reddyice.com/NewDashboardReport/Reports/ReportData.aspx?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsPaperTicket=${this.isPaperTicket}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch}&DistributoID=${this.filter.distributor}&DriverID=${this.filter.driver}`);
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
