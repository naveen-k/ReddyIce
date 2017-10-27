import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../user-management/user-management.interface';
import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
        todaysDate: null,
        endDate: null,
        reportType: 'DR',
        ticketType: 'regular',
        userType: 'internal',
        distributor: 0,
        branch: 1,        
        driver: 1,
        custID: 0,
        custType: 0,
    };

    user: User;
    linkRpt: SafeResourceUrl;

    distributors: any[] = [];

    allCustomers: any[] = [];
    customers: any[] = [];

    drivers: any[] = [];
    driversofDist: any[] = [];
    branches: any[] = [];

    viewReport: boolean = false;
    showSpinner: boolean = false;

    userSubTitle: string = '';

    constructor(
        private userService: UserService,
        private reportService: ReportService,
        private sanitizer: DomSanitizer,
        protected modalService: NgbModal,
        protected notification: NotificationsService,
    ) { }

    ngOnInit() {
        const now = new Date();
        this.filter.startDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.endDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

        this.user = this.userService.getUser();
        if (this.user.IsDistributor) {
            this.filter.userType = 'external';
            this.filter.reportType = 'DST';
            this.filter.distributor = this.user.Distributor.DistributorMasterId;
            this.userSubTitle = `- ${this.user.Distributor.DistributorName}`;
        }

        this.userTypeChangeHandler();
    }

    reportTypeChangeHandler() {
        this.viewReport = false;
        switch (this.filter.reportType) {
            case 'DST':
                this.filter.userType = 'external';
                break;
            case 'IOA':
                this.getCustomers();
                break;
        }

        this.userTypeChangeHandler();
    }

    getAllBranches() {
        this.reportService.getBranches().subscribe((res) => {
            this.branches = this.reportService.transformOptionsReddySelect(res, 'BranchID', 'BranchName');
            this.branchChangeHandler(this.filter.branch);
        }, (err) => { });
    }

    getDistributors() {
        this.reportService.getDistributors().subscribe((res) => {
            res.unshift({ DistributorCopackerID: 0, Name: 'All Distributors' });
            this.distributors = this.reportService.transformOptionsReddySelect(res, 'DistributorCopackerID', 'Name');
            this.distributorChangeHandler();
        }, (err) => { });
    }

    branchChangeHandler(branchID) {
        this.reportService.getDriversbyBranch(this.filter.branch).subscribe((res) => {
            res.unshift({ UserId: 1, UserName: 'All Drivers' });
            this.drivers = this.reportService.transformOptionsReddySelect(res, 'UserId', 'UserName');
        }, (err) => { });
        this.filter.custID = 0;
        this.filter.driver = 1;
        this.getCustomers();
    }

    distributorChangeHandler() {
        const distributor = this.filter.distributor === 1 ? 0 : this.filter.distributor;
        this.reportService.getDriversbyDistributors(distributor || 0).subscribe((res) => {
            res.unshift({ UserId: 1, FirstName: 'All Drivers' });
            this.driversofDist = this.reportService.transformOptionsReddySelect(res, 'UserId', 'FirstName');;
        }, (err) => {
        });
        this.filter.custID = 0;
        this.filter.driver = 1;
        this.getCustomers();
    }


    userTypeChangeHandler() {
        if (this.filter.userType === 'internal') {
            this.getAllBranches();
        } else {
            this.getDistributors();
        }
        if (!this.user.IsDistributor) {
            this.filter.branch = 1;
            this.filter.distributor = 0;
        }
    }

    getCustomers() {
        this.showSpinner = true;
        this.reportService.getCustomersByBranchandDist(this.filter.userType, this.filter.branch, this.filter.distributor).subscribe(res => {
            res.unshift({
                CustomerId: 0,
                CustomerName: 'All Customer',
                EmailId: '',
                IsActive: true,
            });
            this.showSpinner = false;
            this.allCustomers = this.reportService.transformOptionsReddySelect(res, 'CustomerId', 'CustomerName');
            this.customers = [...this.allCustomers];
        }, (err) => {
            this.showSpinner = false;
            this.customers = [];
        });
    }

    customerTypeChange() {
        this.customers = this.allCustomers.filter((cust) => {
            if (+this.filter.custType === 0 || cust.value === 0) { return true }
            else if (+this.filter.custType === 101) { return cust.IsRICustomer }
            else if (+this.filter.custType === 103) { return !cust.IsRICustomer }
        });
        console.log(this.customers);
    }

    updateLink(rType) {
        this.viewReport = true;
        setTimeout(function () {
            $('#loader').hide();
        }, 5000);
        // hack to check if start date is not greater than end date
        if ((Date.parse(this.formatDate(this.filter.endDate)) < Date.parse(this.formatDate(this.filter.startDate)))) {
            this.notification.error('Start Date cannot be greater than End Date!!!');
            this.viewReport = false;
        }
        const custID = this.filter.custID;
        if (rType === 'DR') {
            this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                (environment.reportEndpoint+`?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=false&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}&CustomerID=${custID}`);
        } else if (rType === 'RS') {

            this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                (environment.reportEndpoint+`?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}&CustomerID=${custID}`);
        } else if (rType === 'SR') {

            this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                (environment.reportEndpoint+`?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsPaperTicket=${this.filter.ticketType === 'paper'}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}&CustomerID=${custID}`);
        } else if (rType === 'TR') {
            this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                (environment.reportEndpoint+`?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustomerID=${custID}&CustType=${this.filter.custType}`);

        } else if (rType === 'AS') {

            this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                (environment.reportEndpoint+`?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}&CustomerID=${custID}`);

        } else if (rType === 'DST') {

            this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                (environment.reportEndpoint+`?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=false&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}&CustomerID=${custID}`);

        } else if (rType === 'IOA') {

            this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                (environment.reportEndpoint+`?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}&CustomerID=${custID}`);

        } else if (rType === 'SRT') {

            this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                (environment.reportEndpoint+`?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}&CustomerID=${custID}`);

        } else {
            return false;
        }

        console.log(this.linkRpt);
    }

    formatDate(startLatestDate) {
        if (!startLatestDate.year) { return ''; }
        let yy = startLatestDate.year, mm = startLatestDate.month, dd = startLatestDate.day;
        if (mm < 10) { mm = '0' + mm }
        if (dd < 10) { dd = '0' + dd }
        return mm + '/' + dd + '/' + yy;
    }
}
