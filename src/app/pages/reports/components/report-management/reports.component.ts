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
        todaysDate: null,
        endDate: null,
        reportType: 'DR',
        ticketType: 'regular',
        userType: 'internal',
        distributor: 0,
        branch: 1,
        internalDriver: null,
        distDriver: null,
        driver: 1,
        custID: 0,
        custType: 0,
    };

    user: User;

    linkRpt: SafeResourceUrl;

    distributors: any = [];
    customers: any = [];
    branches: any = [];
    drivers: any = [];
    driversofDist: any = [];
    isSRReport: boolean = false;
    isTRReport: boolean = false;
    isDRReport: boolean = true;
    isASReport: boolean = false;
    isDSTReport: boolean = false;
    isIOAReport: boolean = false;
    isSRTReport: boolean = false;
    isDistributor: boolean = false;

    viewReport: boolean = false;
    RI: boolean = false;
    isPaperTicket: boolean = false;
    userSubTitle: string = '';

    constructor(
        private sanitizer: DomSanitizer,
        protected userService: UserService,
        protected reportService: ReportService,
        protected modalService: NgbModal,
        protected notification: NotificationsService,
    ) { }
    ngOnInit() {
        const now = new Date();
        this.filter.startDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.endDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

        this.user = this.userService.getUser();
        this.userSubTitle = this.user.IsDistributor ? '-' + ' ' + this.user.Distributor.DistributorName : '';

        // to select Distributor radio button by default if logged in with distributor
        if (this.user.IsDistributor) {
            this.filter.userType = 'external';
            this.isDistributor = true;
            this.filter.reportType = 'AS';
            this.filter.distributor = this.user.Distributor.DistributorMasterId;
            // this.getAllCustomers(this.filter.distributor);
            this.getDistributors();
            this.distributorChangeHandler();
            if (this.user.Role.RoleID === 3) {
                this.filter.driver = this.user.Role.RoleID;
            }
        } else {
            this.isDistributor = false;
            this.getAllBranches();
        }

    }

    getAllBranches() {
        this.reportService.getBranches().subscribe((res) => {

            // this.branches = this.reportService.transformOptionsReddySelect(res,);
            // this.branches.splice(0, 0, branch.BranchID = 0)
            // this.branches = res;
            // this.sortBranches();

            let tempArr = [];
            res.forEach(branch => {
                tempArr.push({
                    value: +branch.BranchID,
                    label: `${branch.BranchName}`,
                    //date: branch,
                });
            });
            this.branches = tempArr;
            this.branchChangeHandler(this.filter.branch);
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

    sortDrivers() {
        // sort by name
        this.drivers.sort(function (a, b) {
            const nameA = a.UserName.toUpperCase(); // ignore upper and lowercase
            const nameB = b.UserName.toUpperCase(); // ignore upper and lowercase
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
            let tempArr = [];
            res.forEach(distributor => {
                tempArr.push({
                    value: +distributor.DistributorCopackerID,
                    label: `${distributor.Name}`,
                    //date: branch,
                });
            });
            tempArr.unshift({ value: 0, label: 'All Distributors' });
            this.distributors = tempArr;
            // this.distributors.splice(0, 0, { 'id': '0', 'Name': '1 - All Distributors' });
        }, (err) => { });
    }

    userTypeChangeHandler() {
        if (this.filter.userType === 'internal') {
            this.filter.distributor = 0;
            this.filter.driver = 0;
            this.getAllBranches();
        } else {
            this.filter.branch = 0;
            this.filter.driver = 0;
            this.getDistributors();
        }
    }
    ticketTypeChangeHandler() {
        if (this.filter.ticketType === 'paper') {
            this.isPaperTicket = true;
        } else {
            this.isPaperTicket = false;
        }
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
        if (rType) {
            if (rType === 'DR') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = true;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isSRTReport = false;
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (`http://frozen.reddyice.com/NewDashboardReport/Reports/ReportData.aspx?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=true&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}`);
            } else if (rType === 'RS') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isSRTReport = false;
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (`http://frozen.reddyice.com/NewDashboardReport/Reports/ReportData.aspx?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}`);
            } else if (rType === 'SR') {
                this.isSRReport = true;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isSRTReport = false;
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (`http://frozen.reddyice.com/NewDashboardReport/Reports/ReportData.aspx?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsPaperTicket=${this.isPaperTicket}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}`);
            } else if (rType === 'TR') {
                this.isSRReport = false;
                this.isTRReport = true;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isSRTReport = false;
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (`http://frozen.reddyice.com/NewDashboardReport/Reports/ReportData.aspx?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&DistributorID=${this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustomerID=${this.filter.custID}&CustType=${this.filter.custType}`);

            } else if (rType === 'AS') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = true;
                this.isDSTReport = false;
                this.isSRTReport = false;
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (`http://frozen.reddyice.com/NewDashboardReport/Reports/ReportData.aspx?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}`);

            } else if (rType === 'DST') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = true;
                this.isSRTReport = false;
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (`http://frozen.reddyice.com/NewDashboardReport/Reports/ReportData.aspx?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=false&DistributorID=${this.filter.distributor}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}`);

            } else if (rType === 'IOA') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isIOAReport = true;
                this.isSRTReport = false;
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (`http://frozen.reddyice.com/NewDashboardReport/Reports/ReportData.aspx?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}`);

            } else if (rType === 'SRT') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isIOAReport = false;
                this.isSRTReport = true;
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (`http://frozen.reddyice.com/NewDashboardReport/Reports/ReportData.aspx?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}`);

            } else {
                return false;
            }
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

    branchChangeHandler(branchID) {
        this.reportService.getDriversbyBranch(this.filter.branch).subscribe((res) => {
            this.drivers = res;
            // this.drivers.splice(0, 0, { 'UserName': 'All Drivers' });
            //this.sortDrivers();
            let tempArr = [];
            this.showSpinner = false;
            res.forEach(driver => {
                tempArr.push({
                    value: +driver.UserId,
                    label: `${driver.UserName}`,
                    //date: branch,
                });
            });
            tempArr.unshift({ value: 1, label: 'All Drivers' });
            this.drivers = tempArr;
        }, (err) => { });

        this.getCustomers(branchID);
    }

    distributorChangeHandler() {
        this.reportService.getDriversbyDistributors(this.filter.distributor).subscribe((res) => {
            this.driversofDist = res;
            let tempArr = []
            res.forEach(driver => {
                tempArr.push({
                    value: driver.UserId,
                    label: `${driver.FirstName}`,
                    //date: branch,
                });
            });
            tempArr.unshift({ value: 1, label: 'All Drivers' });
            this.driversofDist = tempArr;
            // this.driversofDist.splice(0, 0, { 'FirstName': 'All Drivers' });
        }, (err) => {

        });

    }
    reportTypeChangeHandler(rType) {
        this.viewReport = false;
        if (rType) {
            if (rType === 'DR') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = true;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isSRTReport = false;
                if (this.user.IsDistributor) {
                    this.filter.userType = 'external';
                    this.getDistributors();
                } else {
                    this.filter.userType = 'internal';
                    this.getAllBranches();
                }
            } else if (rType === 'RS') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isSRTReport = false;
                if (this.user.IsDistributor) {
                    this.filter.userType = 'external';
                    this.getDistributors();
                } else {
                    this.filter.userType = 'internal';
                    this.getAllBranches();
                }

            } else if (rType === 'SR') {
                this.isSRReport = true;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isSRTReport = false;
                if (this.user.IsDistributor) {
                    this.filter.userType = 'external';
                    this.getDistributors();
                } else {
                    this.filter.userType = 'internal';
                    this.getAllBranches();
                }

            } else if (rType === 'TR') {
                this.isSRReport = false;
                this.isTRReport = true;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isSRTReport = false;
                if (this.user.IsDistributor) {
                    this.filter.userType = 'external';
                    this.getDistributors();
                } else {
                    this.filter.userType = 'internal';
                    this.getAllBranches();
                }

            } else if (rType === 'AS') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = true;
                this.isDSTReport = false;
                this.isSRTReport = false;
                if (this.user.IsDistributor) {
                    this.filter.userType = 'external';
                    this.getDistributors();
                } else {
                    this.filter.userType = 'internal';
                    this.getAllBranches();
                }

            } else if (rType === 'DST') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = true;
                this.isSRTReport = false;
                this.filter.userType = 'external';
                this.getDistributors();

            } else if (rType === 'IOA') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isIOAReport = true;
                this.isSRTReport = false;
                if (this.user.IsDistributor) {
                    this.filter.userType = 'external';
                    this.getDistributors();
                } else {
                    this.filter.userType = 'internal';
                    this.getAllBranches();
                }

            } else if (rType === 'SRT') {
                this.isSRReport = false;
                this.isTRReport = false;
                this.isDRReport = false;
                this.isASReport = false;
                this.isDSTReport = false;
                this.isIOAReport = false;
                this.isSRTReport = true;
                if (this.user.IsDistributor) {
                    this.filter.userType = 'external';
                    this.getDistributors();
                } else {
                    this.filter.userType = 'internal';
                    this.getAllBranches();
                }
            } else {
                return;
            }


        }
    }
    showSpinner: boolean = false;
    getCustomers(branchID) {
        this.showSpinner = true;
        if (this.filter.reportType === 'TR'|| this.filter.reportType === 'IOA') {
            this.reportService.getCustomersByBranchandDist(branchID, 0).subscribe((res) => {
                this.showSpinner = false;
                this.customers = res;
                let tempArr = []
                res.forEach(cust => {
                    tempArr.push({
                        value: +cust.CustomerId,
                        label: `${cust.CustomerName}`,
                        //date: branch,
                    });
                });
                tempArr.unshift({ value: 0, label: 'All Customers' });
                this.customers = tempArr;
            }, (err) => {
                this.customers = [];
                this.showSpinner = false;
            });
        }
    }

    getAllCustomers(distID) {
        debugger
        console.log(this.filter.reportType);
        if (this.filter.reportType === 'TR' || this.filter.reportType === 'IOA') {
            this.reportService.getCustomersByBranchandDist(0, distID).subscribe((res) => {
                this.customers = res;
                let tempArr = [];
                res.forEach(cust => {
                    tempArr.push({
                        value: +cust.CustomerId,
                        label: `${cust.CustomerName}`,
                        //date: branch,
                    });
                });
                tempArr.unshift({ value: 0, label: 'All Customers' });
                this.customers = tempArr;
            }, (err) => {

            });
        }
    }
}
