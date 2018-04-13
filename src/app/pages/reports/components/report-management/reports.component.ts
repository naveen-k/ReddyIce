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
import { debounce } from 'rxjs/operator/debounce';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
    overlayCounter:any =0;
    overlayStatus: boolean = false;
    onLoadFrame: boolean = false;
    viewButtonStatus: boolean = false;
    cacheBranches;
    cacheRBranches;
    cacheDistributor;
    selectedCustomerType: number = 0;
    isITAdmin: boolean = false;
    isInternalAdmin: boolean = false;
    isExternalAdmin: boolean = false;
    isInternalDriver: boolean = false;
    isExternalDriver: boolean = false;
    isSTech: boolean = false;
    filter: any = {
        startDate: null,
        todaysDate: null,
        endDate: null,
        reportType: 'AS',
        ticketType: 'regular',
        invoiceTicketType: '0',
        userType: 'internal',
        distributor: 0,
        branch: 0,
        driver: 1,
        stech: 0,
        custID: 0,
        fesCustID: 0,
        AssetID: 0,
        custtID: 0,
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
        modifiedEndDateforDriver: null,
        manifestDate: null,
        workOrderId: null,
        RouteNumber: 0,
        CustomerSourceID : 0
    };

    // Customer input formatter
  inputFormatter = (res => (res.AXCustomerNumber.trim()!='')?`${res.AXCustomerNumber} - ${res.CustomerName}`:`${res.CustomerName}`);
  search = (text$: Observable<any>) => { var self = this; return text$.debounceTime(200)
    .distinctUntilChanged()
    .map(term => {
      return self.dropDownCustomers.filter((v: any) => {
        let flag
          term = term.trim();
          flag = (v.CustomerName.toLowerCase().indexOf(term.toLowerCase()) > -1
            || ((v.AXCustomerNumber)?v.AXCustomerNumber:'').toString().toLowerCase().indexOf(term.toLowerCase()) > -1) && (this.filter.custType == v.CustomerSourceID || +this.filter.custType==0);
            if(!flag){
                this.filter.custID = 0;
                this.customerstatus = this.filter.custType;
            }
      return flag;
      }).slice(0, 20);
    })
  };

    hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

    user: User;
    linkRpt: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');

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
    fesCustomers: any = [];
    fesCustomerss: any = [];
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

        this.filter.manifestDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

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
        } else if (this.user.Role.RoleName === "OCS" && this.user.IsRIInternal) {
            this.isITAdmin = true;
        } else if (this.user.Role.RoleName === "Admin" && this.user.IsRIInternal) {
            this.isInternalAdmin = true;
        } else if (this.user.Role.RoleName === "Admin" && !this.user.IsRIInternal) {
            this.isExternalAdmin = true;
        } else if (this.user.Role.RoleName === "Driver" && this.user.IsRIInternal) {
            this.isInternalDriver = true;
        } else if (this.user.Role.RoleName === "Driver" && !this.user.IsRIInternal) {
            this.isExternalDriver = true;
        } else if (this.user.Role.RoleName === "Manager" && this.user.IsRIInternal) {
            this.isInternalAdmin = true;
        } else if (this.user.Role.RoleID == 8 && this.user.IsRIInternal) {
            this.isInternalAdmin = true;
        } else if (this.user.Role.RoleID == 8 && !this.user.IsRIInternal) {
            this.isExternalAdmin = true;
        } else if (this.user.Role.RoleID == 5 && this.user.IsRIInternal) {
            this.isSTech = true;
        }

        if (this.isSTech) {
            this.filter.reportType = "WOC";
        }

        if (this.user.Role.RoleID === 3 && this.user.IsSeasonal) {
            this.filter.userType = 'internal';
            this.isInternalDriver = true;
            this.user.IsRIInternal = true;
            this.user.IsDistributor = false;
        }

        this.userTypeChangeHandler();
    }
    
    reportTypeChangeHandler() {
        this.overlayStatus = true;
        this.isTIRCustomers = false;
        this.onLoadFrame = false;
        this.filter.tripState = 0;
        this.disableTrippState = false;
        this.filter.ticketType = 'regular';
        this.IsTIR = false;
        this.yesFlag = false;
        this.viewReport = false;
        this.filter.customer = null;
        this.filter.stech = 1;
        this.filter.branch = 1;
        this.filter.workOrderNumber = null;
        this.filter.ticketNumber = null;
        this.filter.showCustomerDropdown = false;
        this.filter.custtID = 0;
        this.filter.custID = '';
        switch (this.filter.reportType) {
            case 'DST':
                this.filter.userType = 'external';
                if (this.user.Role.RoleID === 2) {
                    this.yesFlag = true;
                }
                this.userTypeChangeHandler();
                break;
            case 'TIR':
                this.IsTIR = true;
                this.overlayStatus = false;
                break;
            case 'IOA':
            default:
                this.IsTIR = false;
                if (this.user.IsDistributor) {
                    this.filter.userType = 'external';
                } else {
                    this.filter.userType = 'internal';
                }
                this.userTypeChangeHandler();
                break;
        }

    }

    getAllBranches() {
        this.branches = [];
        this.stechs = [];
        if (this.cacheRBranches && this.cacheRBranches.length && this.cacheRBranches.length > 0) {
            this.populateRBranches(this.cacheRBranches);
        } else {
            this.reportService.getBranches().subscribe((res) => {
                this.cacheRBranches = res;
                this.populateRBranches(res);
            }, (err) => { this.overlayStatus = false; });
        }

    }
    private populateRBranches(res) {
        if (this.filter.reportType === 'MR') {
            if (Array.isArray(res) && res[0].BranchCode == 1) {
                res.shift();
            }
            // Array.isArray(res) && res.shift();
            this.branches = this.reportService.transformOptionsReddySelect(res, 'BranchID', 'BranchCode', 'BUName');
        } else {
            if (Array.isArray(res) && res[0].BranchCode != 1) {
                res.unshift({ 'BranchID': 1, 'BranchCode': '1', 'BUName': 'All Business Units' });
            }
            this.branches = this.reportService.transformOptionsReddySelect(res, 'BranchID', 'BranchCode', 'BUName');
        }
        this.branchChangeHandler();
        //this.overlayStatus = false;
    }
    private populateCustomerBranch() {
        if (this.filter.reportType === 'EOD') {
            this.branches = JSON.parse(JSON.stringify(this.cacheBranches));
            //this.branches.shift();

        } else {
            this.branches = JSON.parse(JSON.stringify(this.cacheBranches));
        }
        this.fetchSTechByBranch();
    }
    getCustomerBranches() {
        this.branches = [];
        this.stechs = [];
        if (this.cacheBranches) {
            this.populateCustomerBranch();

        } else {
            this.reportService.getCustomerBranches().subscribe((res) => {

                // res.unshift({ 'BranchID': 0, 'BranchCode': '', 'BUName': 'All Business Units' });
                this.cacheBranches = this.reportService.transformOptionsReddySelect(res, 'BranchID', 'BranchCode', 'BUName');
                this.populateCustomerBranch();
                this.overlayStatus = false;
                // this.branchChangeHandler();
            }, (err) => { this.overlayStatus = false; });
        }

    }

    getFesCustomers() {
        this.reportService.getlistofcustomerfes(this.filter.branch, this.filter.modifiedStartDateforDriver, this.filter.modifiedEndDateforDriver).subscribe((res) => {
            //  res.unshift({ 'CustomerID': 0, 'CustomerName': 'All Customers' });
            // this.fesCustomers = this.reportService.transformOptionsReddySelect(res, 'CustomerID', 'CustomerNumber', 'CustomerName');
            // this.fesCustomers.unshift({ value: 0, label: 'All Customers', data: {} });
            // this.fesCustomerss = this.fesCustomers;
            this.dropDownCustomers = res;
            this.dropDownCustomers.unshift({"AXCustomerNumber": "","CustomerID" :0,"CustomerName" :"All Customers", "CustomerSourceID" :0});
            this.overlayStatus = false;
        }, (err) => {
            console.log("Something went wrong while fetching FES Customers");
            this.overlayStatus = false;
        });
    }

    getDistributors() {
        if (this.cacheDistributor && this.cacheDistributor.length && this.cacheDistributor.length > 0) {
            this.populateDistributor(this.cacheDistributor);
        } else {
            this.reportService.getDistributors().subscribe((res) => {
                if (Array.isArray(res) && res[0].DistributorCopackerID != 0) {
                    res.unshift({ DistributorCopackerID: 0, Name: 'All Distributors' });
                }
                this.cacheDistributor = res;
                this.populateDistributor(res);

            }, (err) => { this.overlayStatus = false; });
        }

    }
    private populateDistributor(res) {
        this.distributors = this.reportService.transformOptionsReddySelect(res, 'DistributorCopackerID', 'Name');
        this.distributorChangeHandler();
        this.overlayStatus = false;
    }
    // WOC or EOD
    stechs: any[] = [];
    assets: any[] = [];
    private fetchSTechByBranch() {
        // console.log('api/report/getlistoftripservicetechnician?BranchId=1&TripStartDate=01-11-2017&TripEndDate=01-11-2017');
        if (this.filter.reportType == 'WOC' || this.filter.reportType == 'AT'
        || this.filter.reportType == 'SP' || this.filter.reportType == 'AER'|| this.filter.reportType == 'AMR') {
            this.filter.stech = 1;
            this.reportService.getSTechByBranch(this.filter.branch, this.filter.modifiedStartDateforDriver, this.filter.modifiedEndDateforDriver).subscribe((res) => {
                res.unshift({ UserId: 1, STechName: 'All STech' });
                this.stechs = this.reportService.transformOptionsReddySelect(res, 'UserId', 'STechName');
                this.overlayStatus = false;
            }, (err) => {
                console.log("Something went wrong while fetching STech");
                this.overlayStatus = false;
            });
            // get asset list
            if (this.filter.reportType == 'AT') {
                this.reportService.getAssets(this.filter.branch, this.filter.modifiedStartDateforDriver, this.filter.modifiedEndDateforDriver).subscribe((res) => {
                    //res.unshift({ UserId: 1, STechName: 'All STech' });
                    //this.assets = this.reportService.transformOptionsReddySelect(res, 'UserId', 'STechName');
                    res.AssetList.unshift({ AssetID: 0, AssetName: 'All Assets' });
                    this.assets = res;
                    this.assets = this.reportService.transformOptionsReddySelect((res.AssetList) ? res.AssetList : res, 'AssetID', 'AssetName');
                    this.overlayStatus = false;
                }, (err) => {
                    console.log("Something went wrong while fetching assets");
                    this.overlayStatus = false;
                });
            }
            //
        } else if (this.filter.reportType == 'EOD') {
            this.reportService.getSTechByBranch(this.filter.branch, this.formatDate(this.filter.manifestDate), this.formatDate(this.filter.manifestDate)).subscribe((res) => {
                res.unshift({ UserId: 1, STechName: 'All STech' });
                this.stechs = this.reportService.transformOptionsReddySelect(res, 'UserId', 'STechName');
                this.overlayStatus = false;
            }, (err) => {
                console.log("Something went wrong while fetching STech");
                this.overlayStatus = false;
            });
        }
    }

    branchChangeHandler() {
        this.overlayStatus = true;
        this.overlayCounter =0;
        this.filter.modifiedStartDateforDriver = this.modifyDate(this.filter.startDate);
        this.filter.modifiedEndDateforDriver = this.modifyDate(this.filter.endDate);

        
        this.filter.custID = '';
        if (this.user.Role.RoleName === 'Driver') {
            this.filter.driver = this.user.UserId;
        } else {
            this.filter.driver = 1;
        }

        if (this.filter.reportType == 'MR') {
            this.routeNumberChange();
        }
        if (this.filter.reportType == 'SSR') {
            this.getRoutesForRange();
        }

        // restricting unnecessary call for WONS, DST, MR, TIR reports
        if (this.filter.reportType != 'DST' && this.filter.reportType != 'TIR' &&
            this.filter.reportType != 'WONS' && this.filter.reportType != 'MR') {
            this.overlayCounter++;
            this.reportService.getDriversbyBranch(this.filter.branch, this.user.UserId, this.filter.modifiedStartDateforDriver, this.filter.modifiedEndDateforDriver, this.filter.distributor).subscribe((res) => {
                res.unshift({ DriverId: 1, DriverName: 'All Drivers' });
                this.drivers = this.reportService.transformOptionsReddySelect(res, 'DriverId', 'DriverName');
                this.overlayCounter--;
                if(this.overlayCounter<=0)
                {
                    this.overlayStatus = false;
                }
            
            }, (err) => { this.overlayStatus = false; });
        } else {
            this.overlayStatus = false;
        }
        this.getCustomers();
    }
    dateChangeHandler(){
        if(this.filter.userType=='internal')
        {
            this.branchChangeHandler();
        } else{
            this.distributorChangeHandler();
        }
        
       

    }
    distributorChangeHandler() {
        const distributor = this.filter.distributor === 1 ? 0 : this.filter.distributor;
        this.reportService.getDriversbyDistributors(distributor || 0).subscribe((res) => {
            res.unshift({ UserId: 1, FirstName: 'All Drivers', LastName: '' });
            this.driversofDist = this.reportService.transformOptionsReddySelect(res, 'UserId', 'FirstName', 'LastName', ' ');
        }, (err) => {
        });
        this.filter.custID = '';
        if (this.user.Role.RoleName === 'Driver') {
            this.filter.driver = this.user.UserId;
        } else {
            this.filter.driver = 1;
        }
         this.getCustomers();
    }


    userTypeChangeHandler() {
        this.overlayStatus = true;
        this.viewReport = false;
        this.filter.customer = null;
        if (this.filter.userType === 'internal') {
            if (this.filter.reportType == 'EOD' || this.filter.reportType == 'WOC' || this.filter.reportType == 'AT'
            || this.filter.reportType == 'SP' || this.filter.reportType == 'AER'|| this.filter.reportType == 'AMR') {
                this.filter.modifiedStartDateforDriver = this.modifyDate(this.filter.startDate);
                this.filter.modifiedEndDateforDriver = this.modifyDate(this.filter.endDate);
                this.getCustomerBranches();
                this.getFesCustomers();
            } else if (this.filter.reportType !== 'WONS') {
                this.getAllBranches();
            } else {
                this.overlayStatus = false;
                this.viewReport = true;
            }
        } else {
            this.getDistributors();
        }
        if (!this.user.IsDistributor) {
            this.filter.branch = 1;
            this.filter.distributor = 0;
        }
        // if (this.filter.reportType == 'EOD') {
        //     this.filter.branch = 0;
        // }
    }

    routes: any[] = [];
    routeNumberChange() {
        this.reportService.getManifestRoutes(this.filter.branch, this.formatDate(this.filter.manifestDate)).subscribe((res) => {
            //this.routes = res;
            this.routes = res.map((v) => { return { value: v, label: v } });
            //this.routes = this.reportService.transformOptionsReddySelect(res, 'UserId', 'FirstName', 'LastName', ' ');
        }, (err) => {
        });
    }

    getRoutesForRange() {
        this.reportService.getRoutesForRange(this.filter.branch, this.formatDate(this.filter.startDate), this.formatDate(this.filter.endDate)).subscribe((res) => {
            this.routes = res.map((v) => { return { value: v, label: v } });
        }, (err) => {
        });
    }

    focuOutCustomer() {

    }

    customerTypeChange(custType) {
        if (custType) {
            this.customerstatus = custType;
        }
        this.filter.custID = '';
        this.filter.custtID = 0;
        //this.filterCustomers();
    }


    isTIRCustomers = false;
    getCustomersbyTicketNumber(ticketNumber) {

        this.viewButtonStatus = true;
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
                    this.isTIRCustomers = false;
                } else {
                    this.viewReport = false;
                    this.filter.ticketID = '';
                    // this.notification.error('No Customer Found!!!');
                }

                ////
                this.viewReport = false;
                if (this.customersByTicketNumber && this.customersByTicketNumber.length > 1) {
                    this.filter.showCustomerDropdown = true;
                    if (this.filter.ticketID) {
                        this.filter.custID = this.filter.customer ? this.filter.customer.CustomerId : 0;
                        this.selectedCustomerType = this.customerstatus;
                        this.viewReport = true;
                        this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl(environment.reportEndpoint + `?Rtype=${this.filter.reportType}&ticketID=${this.filter.ticketID}`)

                    } else {
                        this.viewReport = false;
                    }
                    this.viewButtonStatus = false;
                    this.isTIRCustomers = true;
                } else {
                    this.filter.showCustomerDropdown = false;
                    //this.filter.custID = this.filter.customer ? this.filter.customer.CustomerId : 0;
                    this.selectedCustomerType = this.customerstatus;
                    if (this.customersByTicketNumber && this.customersByTicketNumber.length > 0) {
                        this.viewReport = true;
                    } else {
                        this.viewReport = false;
                        this.onLoadFrame = false;
                        this.notification.error('Ticket Number Not Found!!');
                    }
                    this.filter.showCustomerDropdown = false;
                    this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl(environment.reportEndpoint + `?Rtype=${this.filter.reportType}&ticketID=${this.filter.ticketID}`)

                }
                console.log('from method: ', this.linkRpt);
                ////
            }, (err) => {
                this.viewButtonStatus = false;
            });
        } else {
            this.notification.error("Please enter a valid ticket number.");
            this.viewButtonStatus = false;
            this.isTIRCustomers = true;
        }
    }

    getWorkOrderIdByTicketNumber(workOrderNumber) {
        if (workOrderNumber) {
            this.reportService.checkworkorderexistence(workOrderNumber).subscribe((res) => {

                if (res != 0) {
                    this.filter.workOrderId = res;
                    this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                        (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&WOID=${this.filter.workOrderId}&LoggedInUserID=${this.user.UserId}`);
                    this.overlayStatus = false;
                    this.viewReport = true;
                    console.log('when WONS is clicked', this.linkRpt);
                    this.overlayStatus = false;
                    this.viewReport = true;
                    //this.viewButtonStatus = false;
                } else {
                    this.onLoadFrame = false;
                    this.notification.error("Work Order Number Does Not Exist.");
                    this.overlayStatus = false;
                    this.viewReport = true;
                    this.viewButtonStatus = false;
                }
            }, (err) => {
                this.notification.error("Something went wrong.");
                this.onLoadFrame = false;
                this.overlayStatus = false;
                this.viewReport = true;
                this.viewButtonStatus = false;
            });
        }
    }

    customerChangeHandler() {
        // this.updateLink(this.filter.reportType);
        this.viewButtonStatus = true;
        this.isTIRCustomers = false;
        // Add 2 times because of some times on IE browsers URL not loaded on iframe. 
        this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
            (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&ticketID=${this.filter.ticketID}`)
        this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
            (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&ticketID=${this.filter.ticketID}`)

    }
    updateLink(rType) {
        this.viewButtonStatus = true;
        this.onLoadFrame = true;
        if (rType == 'AT' || rType == 'AER' || rType == 'AMR') {
            this.filter.CustomerSourceID = this.dropDownCustomers.filter((res)=>res.CustomerID == this.filter.custtID)[0]['CustomerSourceID'] || 0;
        }
        if (rType !== 'TIR') {
            //this.filter.custID = this.filter.customer ? this.filter.customer.CustomerId : 0;
            this.selectedCustomerType = this.customerstatus;

            this.viewReport = true;


            // hack to check if start date is not greater than end date
            if ((Date.parse(this.formatDate(this.filter.endDate)) < Date.parse(this.formatDate(this.filter.startDate)))) {
                this.notification.error('Start Date cannot be greater than End Date!!!');
                this.viewReport = false;
            }
            const custID = this.filter.custID;
            if (rType === 'DR') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=true&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.selectedCustomerType}&CustomerID=${this.filter.custtID}&IsPaperTicket=${this.filter.ticketType === 'paper'}`);
            } else if (rType === 'RS') {

                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.selectedCustomerType}&CustomerID=${this.filter.custtID}`);
            } else if (rType === 'SR') {

                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsPaperTicket=${this.filter.ticketType === 'paper'}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustType=${this.selectedCustomerType}&CustomerID=${this.filter.custtID}&TripState=${this.filter.tripState}`);
            } else if (rType === 'TR' || rType === 'RM') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&IsRI=${this.filter.userType === 'internal'}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DistributorID=${this.filter.distributor === 1 ? 0 : this.filter.distributor}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&LoggedInUserID=${this.user.UserId}&CustomerID=${this.filter.custtID}&CustType=${this.selectedCustomerType}&PaymentType=${this.filter.paymentType}&tktTypeID=${this.filter.invoiceTicketType}`);

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

            } else if (rType === 'MR') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&Date=${this.formatDate(this.filter.manifestDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&Route=${this.filter.RouteNumber}`);

            } else if (rType === 'WOC') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&CustomerID=${this.filter.custtID}&STechID=${this.filter.stech === 1 ? 0 : this.filter.stech}&CustType=0&LoggedInUserID=${this.user.UserId}`);
                console.log('when WOC is clicked', this.linkRpt);
            } else if (rType === 'EOD') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&Date=${this.formatDate(this.filter.manifestDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&STechID=${this.filter.stech === 1 ? 0 : this.filter.stech}&LoggedInUserID=${this.user.UserId}`);
                console.log('when EOD is clicked', this.linkRpt);
            } else if (rType === 'WONS') {
                this.getWorkOrderIdByTicketNumber(this.filter.workOrderNumber);
                // this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                // (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&WOID=${this.filter.workOrderId}&LoggedInUserID=${this.user.UserId}`);

                // console.log('when WONS is clicked', this.linkRpt);
            } else if (rType === 'SSR') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DriverID=${this.filter.driver}&Route=${this.filter.RouteNumber}&LoggedInUserID=${this.user.UserId}`);

                console.log('when SSR is clicked', this.linkRpt);
            } else if (rType === 'AT') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&CustomerID=${this.filter.custtID}&assetID=${this.filter.AssetID}&STechID=${this.filter.stech === 1 ? 0 : this.filter.stech}&CustType=${this.filter.CustomerSourceID}&LoggedInUserID=${this.user.UserId}`);
                console.log('when AT is clicked', this.linkRpt);
            } else if (rType === 'SP') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&CustomerID=${this.filter.custtID}&STechID=${this.filter.stech === 1 ? 0 : this.filter.stech}&CustType=0&LoggedInUserID=${this.user.UserId}`);
                console.log('when SP is clicked', this.linkRpt);
            } else if (rType === 'AER') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&CustomerID=${this.filter.custtID}&STechID=${this.filter.stech === 1 ? 0 : this.filter.stech}&CustType=${this.filter.CustomerSourceID}&LoggedInUserID=${this.user.UserId}`);
                console.log('when AER is clicked', this.linkRpt);
            } else if (rType === 'AMR') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&CustomerID=${this.filter.custtID}&CustType=${this.filter.CustomerSourceID}&LoggedInUserID=${this.user.UserId}`);
                console.log('when AMR is clicked', this.linkRpt);
            } else {
                return false;
            }
        }

        if (rType === 'TIR') {
            this.getCustomersbyTicketNumber(this.filter.ticketNumber);
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
        //this.branchChangeHandler(this.filter.branch)
        if (this.filter.reportType == 'WOC' || (this.filter.reportType == 'EOD') || this.filter.reportType == 'AT') {
            this.filter.modifiedStartDateforDriver = this.modifyDate(this.filter.startDate);
            this.filter.modifiedEndDateforDriver = this.modifyDate(this.filter.endDate);
            if (this.filter.branch) {
                this.fetchSTechByBranch();
                this.getFesCustomers();
            }
        } else {
            //this.branchChangeHandler();
            this.viewReport = false;
           
            this.modifiedStartDate = this.modifyDate(this.filter.startDate);
            this.modifiedEndDate = this.modifyDate(this.filter.endDate);
            if (this.filter.reportType != 'DST' && this.filter.reportType != 'TIR' &&
                this.filter.reportType != 'WONS' && this.filter.reportType != 'MR') {
                this.overlayStatus = true;
                this.overlayCounter++;
                this.reportService
                .getCustomerDropDownList(this.filter.branch, this.user.UserId, this.modifiedStartDate, this.modifiedEndDate, this.filter.distributor)
                .subscribe((res) => {
                    this.dropDownCustomers=res;
                    this.dropDownCustomers.unshift({"AXCustomerNumber": "","CustomerID" :0,"CustomerName" :"All Customers", "CustomerSourceID" :"0"});
                    this.overlayCounter--;
                    if(this.overlayCounter<=0)
                    {
                         this.overlayStatus = false;
                    }
                    // const tempArr = [];
                    // res.forEach(cus => {
                    //     tempArr.push({
                    //         value: `${cus.CustomerID}` + '-' + `${cus.CustomerSourceID}`,
                    //         label: `${cus.AXCustomerNumber} - ${cus.CustomerName}`,
                    //         data: cus,
                    //     });
                    // });
                    // tempArr.unshift({ value: 0, label: 'All Customers', data: {} });
                    // this.dropDownCustomers = tempArr;
                    // this.filterCustomers();
                }, (err) => { 
                    this.overlayStatus = false;
                })
            }
        }
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

    filterFesCustomers() {
        this.viewReport = false;
        var tempfesCustomers = this.fesCustomers;
        this.fesCustomerss = tempfesCustomers.filter((p) => {
            if (+this.filter.custType === 0) {
                return true;
            }
            if (+this.filter.custType === p.data.CustomerSourceID || p.value === 0) {
                return true;
            }
            return false;
        });
    }

    selectedCustomerChange(event) {
        let id= event.item.CustomerID || event.item.CustomerId;
        console.log("<<<<<<<<<<<<<<<<<<<< ",event.item);
        if (id == undefined || id == '' || id == "0") {
            this.filter.custtID = 0;
            this.customerstatus = this.filter.custType;
            return;
        }
        this.customerstatus = event.item.CustomerSourceID;

        this.filter.custtID = id;
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
    private checkIframeLoaded() {
        // Get a handle to the iframe element
        var iframe = document.getElementById('reportFrame');
        // var iframeDoc = iframe[0].contentDocument || iframe[0].contentWindow.document;

        // // Check if loading is complete
        // if (  iframeDoc.readyState  == 'complete' ) {
        //     //iframe.contentWindow.alert("Hello");
        //     iframe[0].contentWindow.onload = function(){
        //         alert("I am loaded");
        //     };
        //     // The loading is complete, call the function we want executed once the iframe is loaded
        //     this.afterLoading();
        //     return;
        // } 

        // // If we are here, it is not loaded. Set things up so we check   the status again in 100 milliseconds
        // window.setTimeout(this.checkIframeLoaded, 100);
    }
    afterLoading() {
        $('#loader').hide();
        this.viewButtonStatus = false;
        console.log("data loadedd");
    }

}
