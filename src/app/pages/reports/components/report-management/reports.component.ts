import { Observable } from 'rxjs/Rx';
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
    selectedCustomerType: number = 0;
    isITAdmin: boolean = false;
    isInternalAdmin: boolean = false;
    isExternalAdmin: boolean = false;
    isInternalDriver: boolean = false;
    isExternalDriver: boolean = false;
    filter: any = {
        startDate: null,
        todaysDate: null,
        endDate: null,
        reportType: 'AS',
        ticketType: 'regular',
        userType: 'internal',
        distributor: 0,
        branch: 1,
        driver: 1,
        custID: 0,
        custtID:0,
        custType: 0,
        ticketNumber: null,
        custName: 'All Customers',
        showCustomerDropdown: false,
        ticketID: 0,
        custNameforTicket: '',
        customer: '',
        paymentType: '0',
        tripState: 0,
        tripStatus: 0,
        modifiedStartDateforDriver: null,
        modifiedEndDateforDriver: null
    };

    inputFormatter = (res => `${res.CustomerNumber} - ${res.CustomerName}`);
    hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

    // search = (text$: Observable<any>) => text$.debounceTime(300)
    //     .distinctUntilChanged()
    //     .do((term) => this.searching = true)
    //     .switchMap(term => !term.length ? [] :
    //         this.reportService.getCustomerSearch(
    //             term.replace('#', '%23', 'g'),
    //             this.filter.userType, this.filter.branch,
    //             this.filter.distributor,
    //             this.filter.custType,
    //         )
    //             .do(() => this.searching = false)
    //             .catch(() => {
    //                 this.searching = true;
    //                 return Observable.of([]);
    //             }),
    // )
    //     .do(() => this.searching = false)
    //     .merge(this.hideSearchingWhenUnsubscribed)

    user: User;
    linkRpt: SafeResourceUrl;

    distributors: any[] = [];
    modifiedStartDate: any;
    modifiedEndDate: any;
    allCustomers: any[] = [];
    customerstatus: any = 0;
    customers: any[] = [];
    cutommers: any = [];
    customersByTicketNumber: any[];
    dropDownCustomers: any = [];
    drivers: any[] = [];
    driversofDist: any[] = [];
    branches: any[] = [];
    yesFlag: boolean = false;
    IsTIR: boolean = false;
    isDriver: boolean = false;
    viewReport: boolean = false;
    searching: boolean = false;
    disableTrippState: boolean = false;

    userSubTitle: string = '';

    constructor(
        private userService: UserService,
        private reportService: ReportService,
        private sanitizer: DomSanitizer,
        protected modalService: NgbModal,
        protected notification: NotificationsService,
    ) { }

    isRIDriver = false;
    ngOnInit() {
        const now = new Date();
        this.filter.startDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.endDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

        this.user = this.userService.getUser();
        if (this.user.Role.RoleName == 'Driver') {
            this.isRIDriver = true;
        }
        if (this.user.IsDistributor) {
            this.filter.userType = 'external';
            this.filter.reportType = 'DST';
            this.filter.distributor = this.user.Distributor.DistributorMasterId;
            this.userSubTitle = `- ${this.user.Distributor.DistributorName}`;
        }

        if (this.user.Role.RoleName === 'Driver') {
            this.filter.reportType = 'SRT';
            this.isDriver = true;
            this.filter.driver = this.user.UserId;
        } else {
            this.isDriver = false;
        }

        if (this.user.Role.RoleName === "ITAdmin" && this.user.IsRIInternal) {
            this.isITAdmin = true;
        } else if (this.user.Role.RoleName === "Admin" && this.user.IsRIInternal) {
            this.isInternalAdmin = true;
        } else if (this.user.Role.RoleName === "Admin" && !this.user.IsRIInternal) {
            this.isExternalAdmin = true;
        } else if (this.user.Role.RoleName === "Driver" && this.user.IsRIInternal) {
            this.isInternalDriver = true;
        } else if (this.user.Role.RoleName === "Driver" && !this.user.IsRIInternal) {
            this.isExternalDriver = true;
        }

        this.userTypeChangeHandler();
        this.getCustomers();
    }

    reportTypeChangeHandler() {
        this.filter.tripState = 0;
        this.disableTrippState = false;
        this.filter.ticketType = 'regular';
        this.IsTIR = false;
        this.yesFlag = false;
        this.viewReport = false;
        this.filter.customer = null;
        if (this.user.IsRIInternal) {
            this.filter.userType = 'internal';
        }
        switch (this.filter.reportType) {
            case 'DST':
                this.filter.userType = 'external';
                break;
            case 'IOA':
                // this.getCustomers();
                break;
            case 'TIR':
                this.IsTIR = true;
                break;
            default:
                this.IsTIR = false;
                break;
        }
        if (this.user.Role.RoleID === 2 && this.filter.reportType === 'DST') {
            this.yesFlag = true;
        }
        this.userTypeChangeHandler();
    }

    getAllBranches() {
        this.reportService.getBranches().subscribe((res) => {
            // res.shift();
            // res.unshift({ BranchID: 1, BranchName: 'All Branches' });
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
        this.filter.modifiedStartDateforDriver = this.modifyDate(this.filter.startDate);
        this.filter.modifiedEndDateforDriver = this.modifyDate(this.filter.endDate);

        this.reportService.getDriversbyBranch(this.filter.branch, this.user.UserId, this.filter.modifiedStartDateforDriver, this.filter.modifiedEndDateforDriver, this.filter.distributor).subscribe((res) => {
            res.unshift({ DriverId: 1, DriverName: 'All Drivers' });
            this.drivers = this.reportService.transformOptionsReddySelect(res, 'DriverId', 'DriverName');
        }, (err) => { });
        this.filter.custID = 0;
        if (this.user.Role.RoleName === 'Driver') {
            this.filter.driver = this.user.UserId;
        } else {
            this.filter.driver = 1;
        }

        // this.getCustomers();
    }

    distributorChangeHandler() {
        const distributor = this.filter.distributor === 1 ? 0 : this.filter.distributor;
        this.reportService.getDriversbyDistributors(distributor || 0).subscribe((res) => {
            res.unshift({ UserId: 1, FirstName: 'All Drivers', LastName: '' });
            this.driversofDist = this.reportService.transformOptionsReddySelect(res, 'UserId', 'FirstName', 'LastName', ' ');
        }, (err) => {
        });
        this.filter.custID = 0;
        if (this.user.Role.RoleName === 'Driver') {
            this.filter.driver = this.user.UserId;
        } else {
            this.filter.driver = 1;
        }
        // this.getCustomers();
    }


    userTypeChangeHandler() {
        this.viewReport = false;
        this.filter.customer = null;
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

    focuOutCustomer() {

    }

    customerTypeChange(custType) {
       if(custType){
        this.customerstatus=custType;
        
       }
       this.filter.custID = 0;
       this.filterCustomers();
    }

    getCustomersbyTicketNumber(ticketNumber) {
        this.filter.ticketID = '';
        this.filter.showCustomerDropdown = false;
        this.viewReport = false;
        if (ticketNumber) {
            this.reportService.getCustomersonTicketReport(ticketNumber).subscribe((res) => {
                const tempArr = [];
                res.forEach(cust => {
                    tempArr.push({
                        value: +cust.TicketId,
                        label: `${cust.CustomerName}`,
                    });
                });
                this.customersByTicketNumber = tempArr;
                if (this.customersByTicketNumber.length === 1) {
                    this.filter.ticketID = this.customersByTicketNumber[0].value;
                } else {
                    this.viewReport = false;
                    this.filter.ticketID = '';
                    // this.notification.error('No Customer Found!!!');
                }
            }, (err) => {
            });
        }
    }
    customerChangeHandler() {
        this.updateLink(this.filter.reportType);
    }
    updateLink(rType) {
        if (rType !== 'TIR') {
            //this.filter.custID = this.filter.customer ? this.filter.customer.CustomerId : 0;
            this.selectedCustomerType = this.customerstatus;

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
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=true&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.selectedCustomerType}&CustomerID=${this.filter.custtID}`);
            } else if (rType === 'RS') {

                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.selectedCustomerType}&CustomerID=${this.filter.custtID}`);
            } else if (rType === 'SR') {

                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsPaperTicket=${this.filter.ticketType === 'paper'}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.selectedCustomerType}&CustomerID=${this.filter.custtID}&TripState=${this.filter.tripState}`);
            } else if (rType === 'TR') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustomerID=${this.filter.custtID}&CustType=${this.selectedCustomerType}&PaymentType=${this.filter.paymentType}`);

            } else if (rType === 'AS') {

                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.selectedCustomerType}&CustomerID=${this.filter.custtID}`);

            } else if (rType === 'DST') {

                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=false&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&LoggedInUserID=${this.user.UserId}&CustType=${this.filter.custType}&CustomerID=${this.filter.custtID}`);

            } else if (rType === 'IOA') {

                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.selectedCustomerType}&CustomerID=${this.filter.custtID}`);

            } else if (rType === 'SRT') {

                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.selectedCustomerType}&CustomerID=${this.filter.custtID}`);

            } else {
                return false;
            }
        }

        if (rType === 'TIR') {
            this.viewReport = false;
            if (this.customersByTicketNumber.length > 1) {
                this.filter.showCustomerDropdown = true;
                console.log(this.filter.ticketID);
                if (this.filter.ticketID) {
                    console.log(this.filter.ticketID);
                    this.filter.custID = this.filter.customer ? this.filter.customer.CustomerId : 0;
                    this.selectedCustomerType = this.customerstatus;
                    this.viewReport = true;
                    setTimeout(function () {
                        $('#loader').hide();
                    }, 5000);
                    this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl(environment.reportEndpoint + `?Rtype=${this.filter.reportType}&ticketID=${this.filter.ticketID}`)
                } else {
                    this.viewReport = false;
                }
            } else {
                this.filter.showCustomerDropdown = false;
                // console.log(this.customersByTicketNumber[0].TicketId);
                //this.filter.custID = this.filter.customer ? this.filter.customer.CustomerId : 0;
                this.selectedCustomerType = this.customerstatus;
                if (this.customersByTicketNumber.length > 0) {
                    this.viewReport = true;
                } else {
                    this.viewReport = false;
                    this.notification.error('Ticket Number Not Found!!');
                }

                setTimeout(function () {
                    $('#loader').hide();
                }, 5000);
                this.filter.showCustomerDropdown = false;
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl(environment.reportEndpoint + `?Rtype=${this.filter.reportType}&ticketID=${this.filter.ticketID}`)

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
    modifyDate(modifyDate) {
        if (!modifyDate.year) { return ''; }
        let yy = modifyDate.year, mm = modifyDate.month, dd = modifyDate.day;
        if (mm < 10) { mm = '0' + mm }
        if (dd < 10) { dd = '0' + dd }
        return yy + '/' + mm + '/' + dd;
    }
    getCustomers() {
        this.branchChangeHandler(this.filter.branch)
        this.viewReport = false;
        this.modifiedStartDate = this.modifyDate(this.filter.startDate);
        this.modifiedEndDate = this.modifyDate(this.filter.endDate);
        this.reportService
            .getCustomerDropDownList(this.filter.branch, this.user.UserId, this.modifiedStartDate, this.modifiedEndDate, this.filter.distributor)
            .subscribe((res) => {
                //this.dropDownCustomers=res;
                const tempArr = [];
                res.forEach(cus => {
                    tempArr.push({
                        value: `${cus.CustomerID}`+'-'+`${cus.CustomerSourceID}`,
                        label: `${cus.CustomerName}`,
                        data: cus,
                    });
                });
                tempArr.unshift({ value: 0, label: 'All Customers', data: {} });
                this.dropDownCustomers = tempArr;
                console.log(this.dropDownCustomers);
                this.filterCustomers();
            }, (err) => { })
    }

    filterCustomers() {
        this.viewReport = false;
        this.cutommers = this.dropDownCustomers.filter((p) => {
            if (+this.filter.custType === 0) {
                return true;
            }
            if (+this.filter.custType === p.data.CustomerSourceID || p.value === 0) {
                return true;
            }
            return false;
        });
    }
    selectedCustomerChange(id) {
        if(id ==undefined || id == '' || id=="0"){
            this.filter.custtID = 0;
            return;
        }
        let custTemp:string[] = id.split('-');
        
        console.log(id);
        for (let i = 0; i < this.cutommers.length; i++) {
            if (this.cutommers[i].data) {
                if (this.cutommers[i].data.CustomerID) {
                    if (this.cutommers[i].data.CustomerID == custTemp[0] && this.cutommers[i].data.CustomerSourceID == custTemp[1]) {
                        this.customerstatus = this.cutommers[i].data.CustomerSourceID;
                        this.filter.custtID=this.cutommers[i].data.CustomerID;
                        break;
                    } else if(custTemp[0] == "0"){
                        this.filter.custtID = 0;
                    }
                }else {
                    if(this.filter.custType === 0){
                        this.customerstatus=0;
                    }else{
                        this.customerstatus = this.customerstatus;
                    }
                }
            }
        }
        this.viewReport = false;
    }
    disableTripState() {
        this.filter.tripState = 0;
        this.disableTrippState = true;
    }
    enableTripState() {
        this.filter.tripState = 0;
        this.disableTrippState = false;
    }
    driverChange() {

        this.viewReport = false;
    }
}
