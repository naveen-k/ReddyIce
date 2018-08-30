import { Observable } from 'rxjs/Rx';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../user-management/user-management.interface';
import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../../../../shared/user.service';
import { ReportService } from '../../reports.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { debounce } from 'rxjs/operator/debounce';
import { CacheService } from '../../../../shared/cache.service';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
    @ViewChild('typeaheadBasic') typeaheadBasic: ElementRef;
    overlayCounter: any = 0;
    overlayStatus: boolean = false;
    onLoadFrame: boolean = false;
    viewButtonStatus: boolean = false;
	buttonAction:boolean = false;
	refreshMessage:string = "Please click View Report button to get latest data";
    selectedCustomerType: number = 0;
    isITAdmin: boolean = false;
    isInternalAdmin: boolean = false;
    isExternalAdmin: boolean = false;
    isInternalDriver: boolean = false;
    isExternalDriver: boolean = false;
    isSTech: boolean = false;
    isSearchText = false;
    isSuported = true;
	routes: any = [];
	Allbranches:any;
    filter: any = {startDate: null,todaysDate: null,
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
        CustomerSourceID: 0,
		istir:false,
    };

    // Customer input formatter
    inputFormatter = (res => (res.AXCustomerNumber.trim() != '') ? `${res.AXCustomerNumber} - ${res.CustomerName}` : `${res.CustomerName}`);
    search = (text$: Observable<any>) => {
        var self = this; return text$.debounceTime(200)
            .distinctUntilChanged()
            .map(term => {
                if (term.trim() != '') {
                    this.isSearchText = true;
                } else {
                    this.isSearchText = false;
                }
                return self.dropDownCustomers.filter((v: any) => {
                    let flag;
                    term = term.trim();
                    var joint = (((v.AXCustomerNumber) ? v.AXCustomerNumber : '').toString() + ' - ' + v.CustomerName).toLowerCase();
				
                    flag = (joint.indexOf(term.toLowerCase()) > -1 || v.CustomerName.toLowerCase().indexOf(term.toLowerCase()) > -1
                        || ((v.AXCustomerNumber) ? v.AXCustomerNumber : '').toString().toLowerCase().indexOf(term.toLowerCase()) > -1) && (this.filter.custType == v.CustomerSourceID || +this.filter.custType == 0);
                   
					if (!flag) {
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
	allDrivers:any[] = [];
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
		private cacheService: CacheService,
    ) { }

    isRIDriver = false;
    ngOnInit() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        var trident = ua.indexOf('Trident/');
        var edge = ua.indexOf('Edge/');
        if (msie > 0 || trident > 0 || edge > 0) {
            this.isSuported = false;
        }

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
            this.filter.reportType = 'DST' || 'DHH';
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
		if (!this.user.IsDistributor) {
            this.filter.branch = 0;
            this.filter.distributor = 0;
        }
		if (this.cacheService.has("reportfilterdata")) {
			
					this.cacheService.get("reportfilterdata").subscribe((res) => {
					this.filter = res;
					this.IsTIR = this.filter.istir;
						
					});
	     }
        this.userTypeChangeHandler();
		this.getDrivers();
		if (this.filter.reportType == 'MR' && this.filter.branch > 0) {
			this.drivers = [];
			this.routes = [];
            this.branchChangeHandler();
        }
        if (this.filter.reportType == 'SSR' && this.filter.branch > 0) {
            this.getRoutesForRange();
        }
		if(this.filter.reportType === 'AT' || this.filter.reportType === 'AER' || this.filter.reportType === 'SP' || this.filter.reportType === 'WOC' || this.filter.reportType === 'EOD' ){
			this.fetchSTechByBranch();
			
		}
		this.getCustomers();
		this.validateData();
		
    }
	refreshDataHandler(byType: any = '',event)
	{
		if(byType === "userTypeChange"){
			this.userTypeChangeHandler();
		}else if( byType ==='branchChange' ){
			this.branchChangeHandler("onaction");
		}else if( byType ==='distributorChange' ){
			this.distributorChangeHandler();
		}else if( byType ==='dateChange' ){
			this.dateChangeHandler();
		}else if( byType ==='selectedCustomerChange' ){
			this.selectedCustomerChangeHandler(event);
		}else if( byType ==='reportTypeChange' ){
			this.reportTypeChangeHandler();
		}else if( byType ==='driverChange' && this.filter.reportType === 'MR' ){
			this.driverChangeHandler();
		}
		
		this.validateData();
		if(this.linkRpt){
			this.linkRpt = "";
		   this.refreshMessage = "";
			$('#reportFrame').hide();
			this.viewButtonStatus = false;
		  this.refreshMessage = "Please click View Report button to get latest data";
	   }
		
		this.cacheService.set("reportfilterdata", this.filter);
		
	}

	driverChangeHandler(){
		
		this.drivers.filter((driveritem) => {
			if(driveritem.value === this.filter.driver ){
				let routesarr:any = [];
				let routeID:any;
				routeID = (driveritem.data.RouteNumber === 'Unplanned')?9991:driveritem.data.RouteNumber;
							
				routesarr[0] =  {'value': routeID, 'label': driveritem.data.RouteNumber};
				this.routes = routesarr;
				this.filter.RouteNumber = routeID;
				return true;
			}
		});
	}
	validateData(){
		if(this.filter.reportType != 'MR' && this.filter.reportType != 'AER' && this.filter.reportType != 'WONS' && this.filter.reportType != 'WOC'&& (this.filter.branch || this.filter.distributor) && this.filter.driver )
		{
			
			this.buttonAction = true;
			
			
		}else if((this.filter.reportType === 'AMR' || this.filter.reportType === 'EOD') && this.filter.branch > 0){
			
			this.buttonAction = true;
			
		}else if(this.filter.reportType === 'MR' && this.filter.branch > 0 && this.filter.driver > 0 && this.filter.RouteNumber ){
		
			this.buttonAction = true;
			
		}
		else if((this.filter.reportType === 'DST' || this.filter.reportType === 'DHH') && this.filter.distributor){
			
			this.buttonAction = true;
			
		}else if((this.filter.reportType === 'AER' || this.filter.reportType === 'WOC' || this.filter.reportType === 'SP' || this.filter.reportType === 'AT') && this.filter.branch && this.filter.stech){
			
			this.buttonAction = true;
			
		}else if(this.filter.reportType === 'WONS' && this.filter.workOrderNumber){
			
			this.buttonAction = true;
			
		}else if(this.filter.reportType === 'TIR' && this.filter.ticketNumber){
			
			this.buttonAction = true;
			
		}else{
			this.buttonAction = false;
		    return false;
		}
		return true;
		
	}
	
	
    reportTypeChangeHandler() {
		this.filter.modifiedStartDateforDriver = this.modifyDate(this.filter.startDate);
	    this.filter.modifiedEndDateforDriver = this.modifyDate(this.filter.endDate);
        //this.overlayStatus = true;
        this.isTIRCustomers = false;
        this.onLoadFrame = false;
        this.filter.tripState = 0;
        this.disableTrippState = false;
        this.filter.ticketType = 'regular';
        this.IsTIR = false;
        this.yesFlag = false;
        this.viewReport = false;
        this.filter.customer = null;
		this.filter.stech = 0;
		if (typeof this.Allbranches !== 'undefined' && this.Allbranches.length == 2) {
			this.branches = JSON.parse(JSON.stringify(this.Allbranches));
			this.branches.shift();
            this.filter.branch = this.branches[0].value;
		}else{
			this.filter.branch = 0;
		}
		
		this.filter.driver = 0;
		
        this.filter.workOrderNumber = null;
        this.filter.ticketNumber = null;
        this.filter.showCustomerDropdown = false;
        this.filter.custtID = 0;
        this.filter.custID = '';
		this.IsTIR = false;
				
		if (this.user.IsDistributor) {
			
			this.filter.userType = 'external';
		} else {
			this.filter.distributor = 0;
			this.filter.userType = 'internal';
		}
			if(this.filter.reportType != 'MR' && this.filter.reportType != 'WOC' && this.filter.reportType != 'SP' ){
			
			this.getDrivers();
			if(typeof this.Allbranches !== 'undefined'  && this.filter.userType != 'external' && this.Allbranches.length != 2 ){
				this.branches = JSON.parse(JSON.stringify(this.Allbranches));
			}
			
		}
        switch (this.filter.reportType) {
			case 'MR':
			 case 'SSR':
				 this.drivers = [];
				 this.routes = [];
				 let branch = JSON.parse(JSON.stringify(this.branches));
				 if (typeof this.Allbranches !== 'undefined'  && this.Allbranches.length > 2) {
					 branch.splice(1,1);
					this.branches = branch;
				 }
				 if (typeof this.Allbranches !== 'undefined'  && this.Allbranches.length == 2) {
					  this.branchChangeHandler();
				 }
				
                break;
				case 'SP':
				case 'AT':
				 /*let branchname = JSON.parse(JSON.stringify(this.branches));
				 branchname.splice(1,1);
				 this.branches = branchname;*/
				 this.stechs = [];
				 this.assets = [];
				 if (typeof this.Allbranches !== 'undefined'  && this.Allbranches.length == 2) {
					this.branches = JSON.parse(JSON.stringify(this.Allbranches));
					this.branches.shift();
					this.filter.branch = this.branches[0].value;
				}else{
					this.branches = JSON.parse(JSON.stringify(this.Allbranches));
					this.filter.branch = 0;
				}
				 
				this.fetchSTechByBranch();
				break;
				
				case 'EOD':
				case 'WOC':
				case 'AER':
				case 'AT':
				 this.stechs = [];
				 
                 this.fetchSTechByBranch();
                break;
				case 'TIR':
                this.IsTIR = true;
                break;
				 
				case 'WOC':
				this.IsTIR = true;
				break;
				case 'TR':
				case 'RM':
				case 'SRT':
				case 'SR':
				if(this.filter.userType === 'external' && this.user.IsDistributor){
					this.getUniqDriver();
				}
				break;
				case 'DST':
				
				if (!(this.distributors.length)){
					this.getDistributors();
				}
				
					if (this.user.Role.RoleID === 2) {
						this.yesFlag = true;
					}
				 this.filter.userType = 'external';
                 break;
                 
                 case 'DHH':
                 
                 if (!(this.distributors.length)){
                     this.getDistributors();
                 }
                 
                     if (this.user.Role.RoleID === 2) {
                         this.yesFlag = true;
                     }
                  this.filter.userType = 'external';
                  break;
        }
		this.filter.istir = this.IsTIR; 
		this.cacheService.set("reportfilterdata",this.filter);

    }

  
	getAllBranches() {
        this.reportService.getBranches(this.user.UserId).subscribe((res) => {
			this.Allbranches = JSON.parse(JSON.stringify(res));
			this.branches = JSON.parse(JSON.stringify(res));
			 
			 if (this.branches.length == 2) {
				this.branches.shift();
                this.filter.branch = this.branches[0].value;
				
			}
			
		});
        
    }
   
    getFesCustomers() {
        this.reportService.getlistofcustomerfes(this.filter.branch, this.filter.modifiedStartDateforDriver, this.filter.modifiedEndDateforDriver).subscribe((res) => {
            this.filter.custID = '';
            this.dropDownCustomers = res;
            this.dropDownCustomers.unshift({ "AXCustomerNumber": "", "CustomerID": 0, "CustomerName": "All Customers", "CustomerSourceID": 0, "BranchId": 0 });
            this.overlayStatus = false;
        }, (err) => {
            console.log("Something went wrong while fetching FES Customers");
            this.overlayStatus = false;
        });
    }

	 getDistributors() {
            this.reportService.getDistributerAndCopacker().subscribe((res) => {
				this.distributors = res;
            }, (err) => { this.overlayStatus = false; });
       
    }
   
    // WOC or EOD
    stechs: any = [];
    assets: any = [];
	
	
    private fetchSTechByBranch() {
		this.filter.modifiedStartDateforDriver = this.modifyDate(this.filter.startDate);
	    this.filter.modifiedEndDateforDriver = this.modifyDate(this.filter.endDate);
        if (( this.filter.reportType == 'WOC' || this.filter.reportType == 'AT'
            || this.filter.reportType == 'SP' || this.filter.reportType == 'AER' || this.filter.reportType == 'AMR') && this.filter.branch != 0){
            this.reportService.getSTechByBranch(this.filter.branch, this.filter.modifiedStartDateforDriver, this.filter.modifiedEndDateforDriver).subscribe((res) => {
				
				if(res.length === 0){
					 res.unshift({ value: 0, label: 'No STech found' });

					 this.stechs = res;
					   
				}else if (res.length === 1) {
					 
					 this.stechs = this.reportService.transformOptionsReddySelect(res, 'UserID', 'DriverName');
					this.stechs.unshift({ value: 0, label: 'Select STech' });
				}else {
					let tempStechs:any = [];
					this.stechs = this.reportService.transformOptionsReddySelect(res, 'UserID', 'DriverName');
					this.stechs.forEach(sval => {
						tempStechs[sval.value] = sval;
					});
					
					this.stechs = tempStechs;
					this.stechs.unshift({ value: 1, label: 'All STech' });
					this.stechs.unshift({ value: 0, label: 'Select STech' });
					
				}
				this.filter.stech = 0;
            }, (err) => {
                console.log("Something went wrong while fetching STech");
              
            });
			
			
            // get asset list
            if (this.filter.reportType == 'AT') {
                this.reportService.getAssets(this.filter.branch, this.filter.modifiedStartDateforDriver, this.filter.modifiedEndDateforDriver).subscribe((res) => {
                   
                    res.AssetList.unshift({ AssetID: 0, AssetName: 'All Assets' });
                    this.assets = res;
                    this.assets = this.reportService.transformOptionsReddySelect((res.AssetList) ? res.AssetList : res, 'AssetID', 'AssetName');
                   
                }, (err) => {
                    console.log("Something went wrong while fetching assets");
                    
                });
            }
            //
        } else if (this.filter.reportType == 'EOD' && this.filter.branch != 0) {
            this.reportService.getSTechByBranch(this.filter.branch, this.formatDate(this.filter.manifestDate), this.formatDate(this.filter.manifestDate)).subscribe((res) => {
               if(res.length === 0){
					res.unshift({ value: 0, label: 'No STech found' });

					 this.stechs = res;   
				}else if (res.length === 1) {
					this.stechs = this.reportService.transformOptionsReddySelect(res, 'UserID', 'DriverName');
					this.stechs.unshift({ value: 0, label: 'Select STech' });
				}else {
					this.stechs = this.reportService.transformOptionsReddySelect(res, 'UserID', 'DriverName');
					this.stechs.unshift({ value: 1, label: 'All STech' });
					this.stechs.unshift({ value: 0, label: 'Select STech' });
				}
                
                this.filter.stech = 0;
            }, (err) => {
                console.log("Something went wrong while fetching STech");
               
            });
        }
    }

	 dateChangeHandler() {
		this.filter.modifiedStartDateforDriver = this.modifyDate(this.filter.startDate);
        this.filter.modifiedEndDateforDriver = this.modifyDate(this.filter.endDate);
		
		if((this.filter.reportType === 'AT' ||this.filter.reportType === 'AER' || this.filter.reportType === 'SP' || this.filter.reportType === 'WOC' || this.filter.reportType === 'EOD'  ) && this.filter.branch > 0){
			//this.filter.branch = 0;
			this.stechs = [];
			this.assets = [];
			this.fetchSTechByBranch();
			
			
		}
		if (this.filter.reportType == 'MR' && this.filter.branch > 0) {
            this.branchChangeHandler();
        }
        if (this.filter.reportType == 'SSR') {
			this.filter.branch = 0;
			this.drivers = [];
			this.routes = [];
            //this.getRoutesForRange();
        }
		
    }
    branchChangeHandler(onaction:string = '') {
		this.filter.driver = 0;
        
       

        // restricting unnecessary call for driver select after branch selection
		if( (onaction === "onaction") && this.filter.reportType != 'AER' && this.filter.reportType != 'AMR' && this.filter.reportType != 'AT' && this.filter.reportType != 'MR' && this.filter.reportType != 'EOD' && this.filter.reportType != 'SP' && this.filter.reportType != 'TIR' && this.filter.reportType != 'WOC' && this.filter.reportType != 'WONS'){
			this.selectedBranchDriver();
		}
		
       
		if(this.filter.reportType === 'MR'){
			this.filter.RouteNumber = 0;
			this.routes = [];
			this.drivers = [];
			this.reportService.getTripsForManifestReport(this.formatDate(this.filter.manifestDate), this.filter.branch, true).subscribe((res) => {
				let reportTripData = res.AllTrip;
				let driverlist:any = [];
				let routesarr:any = [];
				if(reportTripData.length){
					for (var i = 0; i < reportTripData.length; i++) {
						let tempdriverObj = {
							'value':reportTripData[i].UserID,
							'label':reportTripData[i].Driver,
							'data':{'BranchID':reportTripData[i].BranchID,'UserId':reportTripData[i].UserID,
							'UserName':reportTripData[i].Driver,
							'RouteNumber':reportTripData[i].RouteNumber
							}
							};
						driverlist.push(tempdriverObj);
						
					}
						this.drivers = driverlist;
						this.filter.driver = this.drivers[0].value;
						let routeID:any;
						routeID = (this.drivers[0].data.RouteNumber === 'Unplanned')?9991:this.drivers[0].data.RouteNumber;
						routesarr[0] =  {'value': routeID, 'label': this.drivers[0].data.RouteNumber};
						this.routes = routesarr;
						
						this.filter.RouteNumber = routeID;
				}else {
					driverlist[0] = {'value':0,'label':'No driver found'};
					this.drivers = driverlist;
					this.filter.driver = this.drivers[0].value;
					routesarr[0] =  {'value': 0, 'label': 'No routes found'};
					this.routes = routesarr;
				}
			this.validateData();
				
			});
			
			
		}
		
		if(this.filter.reportType === 'AT' || this.filter.reportType === 'AER' || this.filter.reportType === 'SP' || this.filter.reportType === 'WOC' || this.filter.reportType === 'EOD' ){
			
			this.stechs = [];
			this.assets = [];
			this.fetchSTechByBranch();
			
		}
		if(this.filter.reportType != 'SSR'){
			this.drivers = this.drivers;
		}
		
		 if (this.filter.reportType == 'SSR') {
            this.getRoutesForRange();
        }
    }


	selectedBranchDriver(){
		if (this.filter.branch > 1 && (this.allDrivers).length > 0){
		
			let drivers = JSON.parse(JSON.stringify(this.allDrivers));
		    (drivers).shift();
		    drivers = drivers.filter((ft) => {
				if(ft.data.BranchID !== null){
					return (ft.data.BranchID === this.filter.branch)?true:false;
				}else{
					return false;
				}
					
			});
			if(this.filter.branch != 1 && drivers.length){
				(drivers).unshift({"value":1,"label":"All - Drivers"});
			}
			if(drivers.length){
				(drivers).unshift({"value":0,"label":"Select Driver"});
			}else{
				(drivers).unshift({"value":0,"label":"No driver found"});
			}
			
			
			
		   this.drivers = drivers;
		}else if( this.filter.branch === 1){
			this.getUniqDriver();
		}else{
			this.drivers = [];
		}
		this.filter.driver = 0;
		
	}
	
	 getDrivers() {
        this.reportService.getAllDriver().subscribe(res => {
           this.allDrivers = JSON.parse(JSON.stringify(res));
		   if((this.filter.userType === 'external' && this.user.IsDistributor) ){
					this.getUniqDriver();
					
			}else{
				this.drivers = [];
			 this.driversofDist = [];
			}
			if(typeof this.Allbranches !== 'undefined' &&  this.Allbranches.length == 2){
				this.selectedBranchDriver();
			}
			
        });
    }
	getUniqDriver(){
		this.drivers = [];
		let tempdriver:any = [];
		let drivers = JSON.parse(JSON.stringify(this.allDrivers));
		  (drivers).shift();
		drivers.filter((dri) => {
			if(this.filter.userType === 'internal' && dri.data.IsRIInternal  && dri.data.IsRIInternal != null){
				
				tempdriver[dri.data.UserId] = dri;
			}
			else if(this.filter.userType === 'external' && !dri.data.IsRIInternal  && dri.data.IsRIInternal != null ){
				
				tempdriver[dri.data.UserId] = dri;
			}else if(dri.data.IsDistributor && dri.data.IsRIInternal  && dri.data.IsRIInternal != null ){
				
				tempdriver[dri.data.UserId] = dri;
			}
			
		});
		
		 this.drivers = tempdriver;
		(this.drivers).unshift({"value":1,"label":"All - Drivers"});
		 (this.drivers).unshift({"value":0,"label":"Select Driver"});
		 this.driversofDist = this.drivers;
		 
	}
  
  distributorChangeHandler() {
		if (this.filter.distributor > 0 && this.allDrivers.length > 0){
			let driversData = JSON.parse(JSON.stringify(this.allDrivers));
			driversData.shift();
			driversData = driversData.filter((ft) => {
				if(ft.data.DistributorCopackerID !== null){
					
					return (ft.data.DistributorCopackerID === this.filter.distributor)?true:false;
				}else{
					return false;
				}
			});
			(driversData).unshift({"value":0,"label":"Select Driver"}, {"value":1,"label":"All - Drivers"});
		     this.driversofDist = driversData;
		}else{
			this.getUniqDriver();
		}
		this.filter.custID = '';
		if (this.user.Role.RoleName === 'Driver') {
            this.filter.driver = this.user.UserId;
        } else {
            this.filter.driver = 0;
        }
            
    }
    userTypeChangeHandler() {
        this.filter.customer = null;
		this.filter.branch = 0;
		if(!(this.filter.userType === 'external' && this.user.IsDistributor)){
			this.filter.distributor = 0;
		}
		
        if (this.filter.userType === 'internal') {
			this.getAllBranches();
			//this.getUniqDriver();
            if (this.filter.reportType == 'EOD' || this.filter.reportType == 'WOC' || this.filter.reportType == 'AT'
                || this.filter.reportType == 'SP' || this.filter.reportType == 'AER' || this.filter.reportType == 'AMR') {
					
                this.filter.modifiedStartDateforDriver = this.modifyDate(this.filter.startDate);
                this.filter.modifiedEndDateforDriver = this.modifyDate(this.filter.endDate);
					
               // this.getCustomerBranches();
                if (this.filter.reportType !== 'EOD' && this.filter.reportType !== 'SP') {
                }
            }
        } else {
            this.getDistributors();
			
			//this.getUniqDriver();
        }
        this.driversofDist = [];
		if(typeof this.Allbranches !== 'undefined' && this.Allbranches.length == 2){
				this.selectedBranchDriver();
		}else{
			this.drivers = [];
		}
		
		if (this.user.Role.RoleName === 'Driver') {
            this.filter.driver = this.user.UserId;
        } else if(!(this.cacheService.has("reportfilterdata"))){
			this.filter.driver = 0;
        }
        this.filter.custID = '';
    }

    
   

    getRoutesForRange() {
		this.drivers = [];
		this.routes = [];
		
		this.filter.modifiedStartDateforDriver = this.modifyDate(this.filter.startDate);
	    this.filter.modifiedEndDateforDriver = this.modifyDate(this.filter.endDate);
       
            this.reportService.getDriverByBranchList(this.filter.modifiedStartDateforDriver,this.filter.branch,true , this.filter.modifiedEndDateforDriver).subscribe((res) => {
				if(res.length === 0){//RouteNumber
					res.unshift({ value: 0, label: 'No driver found' });
					let routesarr:any = [];
					routesarr[0] = { value: 0, label: 'No routes found', };
					this.routes = routesarr;
					this.drivers = res;
					   
				}else if (res.length === 1) {
					
					 this.routes = res.map((v) => { 
					 let routeid:any;
					 routeid = (v.RouteNumber === 'Unplanned')?9991:v.RouteNumber;
					 
					 return { value: routeid, label: v.RouteNumber}

					 });
					this.routes.unshift({ value: 0, label: 'Select routes', });
					
					
					this.drivers = this.reportService.transformOptionsReddySelect(res, 'UserID', 'Driver');
					 this.drivers.unshift({ value: 0, label: 'Select driver' });
				}else {
					let temproutearr:any = [];
					let tempDriverArr:any = [];
					res.forEach((v) => { 
					let routeID:any;
					routeID = (v.RouteNumber === 'Unplanned')?9991:v.RouteNumber;
					
						temproutearr[routeID] = { 'value': routeID, 'label': v.RouteNumber} ;
					
					});
					this.routes = temproutearr;
					this.routes.unshift({ value: 0, label: 'Select routes', });
					let driverlist:any = [];
					
					driverlist = this.reportService.transformOptionsReddySelect(res, 'UserID', 'Driver');
					driverlist.forEach((v) => { 
					
					
						tempDriverArr[v.value] = v;
					
					});
					this.drivers = tempDriverArr;
					this.drivers.unshift({ value: 0, label: 'Select driver' });
					this.filter.driver = 0;
					this.filter.RouteNumber = 0;
				}
            }, (err) => {
                console.log("Something went wrong while fetching STech");
              
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
       // this.filterCustomers();
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
        if (rType == 'WOC' || rType == 'SP' || rType == 'AT' || rType == 'AER' || rType == 'AMR') {
		
          this.dropDownCustomers.filter((res) => {
				if(res.CustomerID === this.filter.custtID){
					   this.filter.CustomerSourceID = res['CustomerSourceID'] || 0;
				}
			});
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

            }else if (rType === 'DHH') {
                
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
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&Date=${this.formatDate(this.filter.manifestDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&DriverID=${this.filter.driver === 1 ? 0 : this.filter.driver}&Route=${this.filter.RouteNumber}`);

            } else if (rType === 'WOC') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&CustomerID=${this.filter.custtID}&STechID=${this.filter.stech === 1 ? 0 : this.filter.stech}&CustType=${this.filter.CustomerSourceID}&LoggedInUserID=${this.user.UserId}`);
                console.log('when WOC is clicked', this.linkRpt);
            } else if (rType === 'EOD') {
                this.linkRpt = this.sanitizer.bypassSecurityTrustResourceUrl
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&Date=${this.formatDate(this.filter.manifestDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&STechID=${this.filter.stech === 1 ? 0 : this.filter.stech}&LoggedInUserID=${this.user.UserId}`);
                console.log('when EOD is clicked', this.linkRpt);
            } else if (rType === 'WONS') {
                this.getWorkOrderIdByTicketNumber(this.filter.workOrderNumber);
           
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
                    (environment.reportEndpoint + `?Rtype=${this.filter.reportType}&StartDate=${this.formatDate(this.filter.startDate)}&EndDate=${this.formatDate(this.filter.endDate)}&BranchID=${this.filter.branch === 1 ? 0 : this.filter.branch}&CustomerID=${this.filter.custtID}&STechID=${this.filter.stech === 1 ? 0 : this.filter.stech}&CustType=${this.filter.CustomerSourceID}&LoggedInUserID=${this.user.UserId}`);
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
		this.refreshMessage = "";
		
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
		  this.reportService.getCustomerDropDownList(this.user.IsRIInternal,this.filter.distributor).subscribe((res) => {
						this.dropDownCustomers = res;
           });
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
onKeydown(event) {
  if (event.key === "Enter") {
	if(this.filter.reportType === "WONS" || this.filter.reportType === "TIR"){
		this.updateLink(this.filter.reportType);
	}
  }
}

    selectedCustomerChangeHandler(event) {
        let id = event.item.CustomerID || event.item.CustomerId;
        if (id === 'undefined' || id == '' || id === 0) {
            this.filter.custtID = 0;
			this.filter.custID = 0;
            this.customerstatus = this.filter.custType;
            return;
        }else{
			this.customerstatus = event.item.CustomerSourceID;
			this.isSearchText = true;
			this.filter.custtID = id;
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
 
    /*private checkIframeLoaded() {
        var iframe = document.getElementById('reportFrame');
       
    }*/
    afterLoading() {
		//var iframe = document.getElementById('reportFrame');
        $('#loader').hide();
		  $('#reportFrame').show();
        this.viewButtonStatus = false;
		console.log("data loadedd");
    }
    clearSearch() {
		
        var self = this;
        setTimeout(function () {
            self.typeaheadBasic.nativeElement.value = '';
            self.filter.custID = '';
			self.filter.custtID = 0;
            self.isSearchText = false;
        }, 100);
    }

}
