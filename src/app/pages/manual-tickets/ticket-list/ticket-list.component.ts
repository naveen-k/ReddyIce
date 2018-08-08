import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { User } from '../../user-management/user-management.interface';
import { Branch } from '../../../shared/interfaces/interfaces';
import { UserService } from '../../../shared/user.service';
import { ManualTicketService } from '../manual-ticket.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { ModelPopupComponent } from 'app/shared/components/model-popup/model-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { TicketFilter } from 'app/pages/manual-tickets/pipes/filter-ticket.pipe';
import { ManualListPipe } from 'app/pages/manual-tickets/pipes/manual-list.pipe';
import { GenericFilter } from 'app/shared/pipes/generic-filter.pipe';
import { GenericSort } from 'app/shared/pipes/generic-sort.pipe';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { CacheService } from '../../../shared/cache.service';



@Component({
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.scss'],
    providers: [TicketFilter, GenericFilter, GenericSort,ManualListPipe]
})
export class TicketListComponent implements OnInit {
	refreshSpinner:boolean = false;
	refreshCheck:boolean = false;
	buttonAction:boolean = false;
	refreshCounter:number = 0;
	nodataMessage:string = "";
	refreshMessage:string = "Please click View Tickets button to get latest data";
	refreshTimestamp:string = "";
    EDIUserName: string;
    overlayStatus: boolean = false;
    counter: number = 0;
    newWindow: any;
    showSpinner: boolean = false;
    selectedAll: any;
    // allbranches related to loggen in usr
    allBranches: Array<any>;

    // logged in user

    user: User = {} as User;
    allTickets: any = [];
    allTicketsTemp: any = [];

    // model search
    searchObj: any = {'userType':'Internal','UserId':0};

   drivers: any[];
	allDrivers: any[];
    distributors: any[];

    todaysDate: any;
    logedInUser: any = {};
    disableApprove: boolean = true;

    searchString: any;
    isDistributorExist: boolean;
    userSubTitle: string = '';
    total: any = {
        totalInvoice: 0,
        totalCash: 0,
        totalCheck: 0,
        totalCharge: 0,
        totalDrayage: 0,
        totalBuyBack: 0,
        totalDistAmt: 0,
    };
    distributorsCache: any = [];
    allFilterdTickets: Array<any> = [];
    customer: any = { sortField: '', isAsc: false };
    searchColumn: Array<any> = ['TicketNumber', 'UserName', 'CustomerName', 'AXCustomerNumber', 'CashAmount', 'TotalSale', 'ticketType']
    // dateFormat = ((date: NgbDateStruct) =>{debugger; return `${date.month}/${date.day}/${date.year}`});

    constructor(
        protected service: ManualTicketService,
        protected userService: UserService,
        protected notificationService: NotificationsService,
        protected activatedRoute: ActivatedRoute,
        protected modalService: NgbModal,
        private ticketFilter: TicketFilter,
        private genericFilter: GenericFilter,
        private genericSort: GenericSort,
		private cacheService: CacheService,
		private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.EDIUserName = environment.EDIUserName;
        const userId = localStorage.getItem('userId') || '';
		
		// Get loggedIn user details
        this.user = this.userService.getUser();
		this.isDistributorExist = this.user.IsDistributor;
        this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + this.user.Distributor.DistributorName : '';
        // load all branches
		
        this.allBranches = JSON.parse(JSON.stringify(this.activatedRoute.snapshot.data['branches']));
		
       this.searchObj = this.service.getSearchedObject();
		this.searchObj = JSON.parse(JSON.stringify(this.searchObj));
		 this.searchObj.BranchId = 0;
		 this.getDrivers();
		 this.getDistributors();
		
		if (typeof this.allBranches !== 'undefined' && this.allBranches.length == 2) {
				this.allBranches.shift();
                this.searchObj.BranchId = this.allBranches[0].value;
				this.branchChangeHandler();
				
				
        }
		this.searchObj.ticketSource = 1;
		
		if (this.cacheService.has("manualfilterdata")) {
			
					this.cacheService.get("manualfilterdata").subscribe((res) => {
					this.searchObj = JSON.parse(JSON.stringify(res));
					this.getUniqDriver();
						
					});
	     }
		
        const now = new Date();
		this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
		 if (this.cacheService.has("manualTicketRefreshtime")) {
			 this.cacheService.get("manualTicketRefreshtime").subscribe((response) => {
						this.refreshTimestamp = response;
					});
		 }
		 if (this.cacheService.has("nodataMessage")&& !(this.cacheService.has("backstatus"))) {
			
			
			this.cacheService.get("nodataMessage").subscribe((response) => {
					this.refreshMessage = "";
					this.nodataMessage = response; 
				
						
				 }); 
		}else if(this.cacheService.has("backstatus")){
			this.cacheService.deleteCache("backstatus");
			this.getRefreshTrip();
		}
		
		
		 if (this.cacheService.has("allFilterdTickets") && !(this.cacheService.has("backtomain"))) {
					this.cacheService.get("allFilterdTickets").subscribe((response) => {
						this.allFilterdTickets = response;
						
				 }); 
				 
			}else if(this.cacheService.has("backtomain")){
				this.cacheService.deleteCache("backtomain");
				this.getRefreshTrip();
			}
			
			if (this.user.IsDistributor && this.user.Distributor.DistributorMasterId && this.searchObj.DistributorID <= 1) {
				
            this.searchObj.DistributorID = this.user.Distributor.DistributorMasterId;
			this.getUniqDriver();
        }
        
		 this.validateData();
   
    }
	
	validateData(){
		
		if((this.searchObj.UserId && this.searchObj.BranchId  && this.searchObj.userType === "Internal") || (this.searchObj.DistributorID && this.searchObj.userType === "External")  )
		{
			
			this.buttonAction = true;
			return true;
			
		}else{
			this.buttonAction = false;
		return false;
		}
	}

   refreshDataHandler(byType: any = '')
	{
		if(byType === "userTypeChange"){
			this.userTypeChangeHandler();
		}else if( byType ==='branchChange' ){
			this.branchChangeHandler();
		}/*else if( byType ==='distributorChange' ){
			this.distributorChangeHandler();
		}*/
		
		this.validateData();
		if(this.allFilterdTickets){
			this.allFilterdTickets = [];
			this.nodataMessage = "";
			this.refreshMessage = "Please click View Tickets button to get latest data";
		}
		this.cacheService.set("allFilterdTickets", this.allFilterdTickets);
		this.cacheService.set("manualfilterdata", this.searchObj);
	}
    getDrivers() {
        this.service.getAllDriver().subscribe(res => {
           this.allDrivers = JSON.parse(JSON.stringify(res));
		  if (typeof this.allBranches !== 'undefined' &&  this.allBranches.length == 2) {
			   this.getUniqDriver();
		   }
		   
        });
    }
	getUniqDriver(){
		this.drivers = [];
		let tempdriver:any = [];
		let drivers = JSON.parse(JSON.stringify(this.allDrivers));
		
		  (drivers).shift();
	
		drivers.filter((dri) => {
			if(this.searchObj.userType === 'Internal' && dri.data.IsRIInternal && dri.data.IsRIInternal != null ){
			
				tempdriver[dri.data.UserId] = dri;
			}
			else if(this.searchObj.userType === 'External' && !dri.data.IsRIInternal && dri.data.IsRIInternal != null ){
				 
				tempdriver[dri.data.UserId] = dri;
			}else if(dri.data.IsDistributor && dri.data.IsRIInternal  && dri.data.IsRIInternal != null ){
				
				tempdriver[dri.data.UserId] = dri;
			}
			
		});
		
		 this.drivers = tempdriver;
		(this.drivers).unshift({"value":1,"label":"All Drivers"});
		 (this.drivers).unshift({"value":0,"label":"Select Driver"});
		 
	}
    getDistributors(byType: any = '') {
        
            this.service.getDistributerAndCopacker().subscribe(res => {
                this.distributors = res;
            });
    }
  
	
	getRefreshTrip(){
        const searchObj = JSON.parse(JSON.stringify(this.searchObj));
		if (searchObj.userType == 'External') { searchObj.BranchId = null; }
        const dt = `${searchObj.CreatedDate.month}-${searchObj.CreatedDate.day}-${searchObj.CreatedDate.year}`;
        this.total = {
            totalInvoice: 0,
            totalCash: 0,
            totalCheck: 0,
            totalCharge: 0,
            totalDrayage: 0,
            totalBuyBack: 0,
            totalDistAmt: 0,
        };
		this.allFilterdTickets = [];
        this.showSpinner = true;
		
		let isRI = ( searchObj.userType === "Internal" )?true:false;
		let sedcondkeyval = ( searchObj.userType === "Internal" )?searchObj.BranchId:searchObj.DistributorID;
		
		this.cacheService.deleteCache("nodataMessage");
		this.cacheService.deleteCache("allFilterdTickets");
		return this.service.getAllTickets(dt, sedcondkeyval , isRI, searchObj.UserId,searchObj.ticketSource).subscribe((response: any) => {
			
                if (response) {
                    this.showSpinner = false;
                    if (!response.length) {
                        this.allTickets = [];
                        this.allTicketsTemp = [];
                        this.allFilterdTickets = [];
                        this.unSelectAll();
						this.refreshMessage = "";
						this.nodataMessage = "No Data Found";
						this.cacheService.set("nodataMessage", this.nodataMessage);
						
                    } else {
                        response.forEach(element => {
                            element['ticketwithRefNo'] = element.TicketReferenceNo ? `${element.TicketReferenceNo} - ${element.TicketNumber}` : element.TicketNumber,
                                element['ticketType'] = this.service.getTicketType(element.IsSaleTicket, element.Customer, element.TicketTypeID, element.CustomerTypeID, element.UserName ? (element.UserName.replace(/\s/g, "").replace(/-+/g, '') == this.EDIUserName) : false)
                        });
                      
                        this.allTickets = response;
                        this.allTicketsTemp = response;
						this.refreshMessage = "";
                        this.allFilterdTickets = this.getFilteredAllTicket();
						
                        this.unSelectAll();
                        this.ticketTotal();
						
						this.cacheService.set("allFilterdTickets", this.allFilterdTickets);
						 this.cacheService.set("manualfilterdata", this.searchObj);
						
                    }
					this.getTimeStamp();
					
                }
            },
                (error) => {
                    if (error) {
                        this.showSpinner = false;
                        this.allTickets = [];
                        this.allFilterdTickets = [];
                        this.unSelectAll();
                    }
                },
            );
	}
	
	sourceChangeHandler(){
		//nothing
	}
	
	getTimeStamp(){
		let now = new Date();
		var dd = (now.getDate() < 10 ? '0' : '') + now.getDate();
		var MM = ((now.getMonth() + 1) < 10 ? '0' : '') + (now.getMonth() + 1);
		
		var hours = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
        var am_pm = now.getHours() >= 12 ? "PM" : "AM";
		var hh = hours < 10 ? "0" + hours : hours;
		
		var mm = ( now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
		this.refreshTimestamp = MM + '/' + dd +" "+ hh + ":" + mm +  " " + am_pm;
		this.cacheService.set("manualTicketRefreshtime", this.refreshTimestamp);
		return true;
		
	}
	
	getFilteredAllTicket() {
        let filterData = [];
       // filterData = this.ticketFilter.transform(this.allTickets, this.searchObj.userType, (this.searchObj.userType === 'Internal') ? 1 : -1);
		
        filterData = this.genericFilter.transform(this.allTickets, this.searchString, this.searchColumn);

        filterData = this.genericSort.transform(filterData, this.customer.sortField, this.customer.isAsc);

        return filterData;
    }
	unSelectAll() {
        this.allFilterdTickets = this.getFilteredAllTicket();
	 
        this.selectedAll = false;
        for (var i = 0; i < this.allFilterdTickets.length; i++) {
            if (this.allFilterdTickets[i].TicketStatusID == 24) {
                this.disableApprove = true;
                this.allFilterdTickets[i].selected = false;
            }
        }
    }
	
	 
	 
    ticketTotal() {
        this.allTickets.forEach(ticket => {
            this.total.totalDistAmt += ticket.DistAmt || 0; ticket.CustomerName = ticket.Customer.CustomerName;
            ticket.AXCustomerNumber = ticket.Customer.AXCustomerNumber;
            ticket.CustomerTitle = ticket.Customer.AXCustomerNumber + " - " + ticket.Customer.CustomerName;
            ticket.TotalSaleWithTax = (+ticket.TotalSale || 0).fpArithmetic("+",(+ticket.TaxAmount || 0));
        });
    }
    // approve all checked tickets
    approveCheckedTickets(flag = '') {
        const selectedIds = [];
        this.allTickets.forEach(element => {
            if (element.selected) {
                selectedIds.push(element.TicketID);
            }
        });

        if (!selectedIds.length) {
            // TODO
            // Show message box 'Nothing to approve, please select some tickets'
            return;
        }
        if (flag) {
            const activeModal = this.modalService.open(ModalComponent, {
                size: 'sm',
                backdrop: 'static',
            });
            activeModal.componentInstance.BUTTONS.OK = 'OK';
            activeModal.componentInstance.showCancel = true;
            activeModal.componentInstance.modalHeader = 'Warning!';
            activeModal.componentInstance.modalContent = `Do you want to delete?`;
            activeModal.componentInstance.closeModalHandler = (() => {
                this.deleteMultiTicketApprovalObject(selectedIds);
            });
        } else {
            this.createMultiTicketApprovalObject(selectedIds);
        }
        this.disableApprove = true;
    }

    ticketSelectionHandler() {
        this.disableApprove = !this.allTickets.filter(element => element.selected).length;
    }

    // create object to approve single/multiple tickets
    createMultiTicketApprovalObject(ticketIds) {
        const ticketObject = {
            TicketID: ticketIds,
            status: 25,
        };

        // call workflow service to approve all the checked ticket numbers
        this.service.approveAllCheckedTickets(ticketObject).subscribe(
            (response) => {
                if (response) {
                    this.notificationService.success('Approved');
                    this.getRefreshTrip(); // in order to refresh the list after ticket status change
                }
            },
            (error) => {
                if (error) {
                    this.notificationService.error('Error', JSON.parse(error._body));
                }
            },
        );
    }

    deleteMultiTicketApprovalObject(ticketIds) {
        const ticketObject = {
            TicketID: ticketIds
        };

        // call workflow service to approve all the checked ticket numbers
        this.service.deleteAllCheckedTickets(ticketObject).subscribe(
            (response) => {
                if (response) {
                    this.notificationService.success('Deleted');
                    this.getRefreshTrip(); // in order to refresh the list after ticket status change
                }
            },
            (error) => {
                if (error) {
                    this.notificationService.error('Error', JSON.parse(error._body));
                }
            },
        );
    }

    userTypeChangeHandler() {
    
	 this.searchObj.UserId = 0;
	 this.searchObj.DistributorID = 0;
	 this.drivers = [];
	if (typeof this.allBranches !== 'undefined' && this.allBranches.length == 1) {
				
			this.searchObj.BranchId = this.allBranches[0].value;
			this.branchChangeHandler();
        }else{
			this.searchObj.BranchId = 0;
		}
	  
	/* if (this.allBranches.length  2) {
			   this.getUniqDriver();
	}else{
		 this.searchObj.BranchId = 0;
	}*/
	 return true;
    }
	branchChangeHandler(){
		
		if (this.searchObj.BranchId > 1 && (this.allDrivers).length > 0){
			let drivers = JSON.parse(JSON.stringify(this.allDrivers));
		    (drivers).shift();
		    drivers = drivers.filter((ft) => {
			
				if(ft.data.BranchID !== null){
					return (ft.data.BranchID === this.searchObj.BranchId)?true:false;
				}else{
					return false;
				}
					
			});
			
			if(this.searchObj.BranchId != 1){
				(drivers).unshift({"value":1,"label":"All Drivers"});
			}
			(drivers).unshift({"value":0,"label":"Select Driver"});
		   this.drivers = drivers;
		}else if( this.searchObj.BranchId === 1){
			this.getUniqDriver();
		}else{
			this.drivers = [];
		}
		this.searchObj.UserId = 0;
	}
   distributorChangeHandler() {
		 
		if (this.searchObj.DistributorID > 0 && this.allDrivers.length > 0){
			
			this.drivers = JSON.parse(JSON.stringify(this.allDrivers));
			(this.drivers).shift();
			this.drivers = this.drivers.filter((ft) => {
				if(ft.data.DistributorCopackerID !== null){
					
					return (ft.data.DistributorCopackerID === this.searchObj.DistributorID)?true:false;
				}else{
					return false;
				}
					
			});
			(this.drivers).unshift({"value":1,"label":"All Drivers"});
			(this.drivers).unshift({"value":0,"label":"Select Driver"});
		}else{
			this.drivers = [];
		}
		
         this.searchObj.UserId = 0;   
    }

    // delete ticket in the draft state
    deleteTicket(ticketNumber) {
        this.service.deleteDraftTicket(ticketNumber).subscribe(
            (response) => {
                if (response) {
                    this.notificationService.success('Ticket deleted successfully');
                    this.getRefreshTrip();
                    this.overlayStatus = false;
                }
            },
            (error) => {
                if (error) {
                    this.notificationService.error(error._body);
                }
                this.overlayStatus = false;
            },
        );
    }

    viewTicket(ticketID) {
        // ticketID = 3212;
        if (ticketID) {
            if (this.newWindow) {
                this.newWindow.close();
            }
            this.newWindow = window.open(environment.reportEndpoint + "?Rtype=TK&TicketID=" + ticketID, "Ticket", "width=560,height=700,resizable=yes,scrollbars=1");
        } else {
            this.notificationService.error("Ticket preview unavailable!!");
        }
    }
    // funtion to retrieve the time
    sliceTime(str) {
        if (str) {
            return str.slice(0, 10);
        }
    }
    showTicketChoice(ticketNumber, customerID, delivered, mode) {
        let deliveryDate = this.sliceTime(delivered);
        this.overlayStatus = true;
        this.service.getSaleCreditTicket(ticketNumber, customerID, deliveryDate).subscribe(
            (response) => {
                if (response) {

                    if (mode == 'delete') {
                        let count = 0;
                        response.forEach(item => {
                            this.service.deleteDraftTicket(item.TicketID).subscribe(
                                (res) => {
                                    if (res) {
                                        count++;
                                        if (count == response.length) {
                                            this.notificationService.success('Ticket deleted successfully');
                                            this.getRefreshTrip();
                                            this.overlayStatus = false;
                                        }

                                    }
                                },
                                (error) => {
                                    if (error) {
                                        this.notificationService.error(error._body);
                                    }
                                    this.overlayStatus = false;
                                },
                            );


                        });
                    }
                    else if (mode == 'edit' || mode == 'view') {
                        const activeModal = this.modalService.open(ModelPopupComponent, {
                            size: 'sm',
                            backdrop: 'static',
                        });
                        let cstring = [];
                        let heading = 'View';
                        response.forEach(item => {
                            if (mode == 'edit') {
                                item.link = `/pages/manual-ticket/ticket/${item.TicketID}`;
                                heading = 'Edit';
                            } else {
                                item.link = `/pages/manual-ticket/view/${item.TicketID}`;
                                heading = 'View'
                            }

                            item.mode = mode;
                            if (item.TicketTypeId == 26) {
                                item.title = "Sale";
                                cstring.push(item);
                            } else if (item.TicketTypeId == 27) {
                                item.title = "Credit";
                                cstring.push(item);
                            }
                        })
                        let ticket = cstring;


                        activeModal.componentInstance.showCancel = false;
                        activeModal.componentInstance.modalHeader = `${heading} Ticket #: ${ticketNumber}`;
                        activeModal.componentInstance.modeltype = 'ticket';
                        activeModal.componentInstance.modalContent = ticket;
                        activeModal.componentInstance.closeModalHandler = (() => {
                            this.overlayStatus = false;
                        });
                    }

                }
            },
            (error) => {
                if (error) {
                    this.notificationService.error(error._body);
                }
            },
        );

    }

    
    selectAll() {
        //this.allFilterdTickets = this.getFilteredAllTicket();

        for (var i = 0; i < this.allFilterdTickets.length; i++) {
            if (this.allFilterdTickets[i].TicketStatusID == 24) {
                this.disableApprove = (this.selectedAll == false) ? true : false;
                this.allFilterdTickets[i].selected = this.selectedAll;
            }
        }

    }
    checkIfAllSelected() {
        //this.allFilterdTickets = this.getFilteredAllTicket();
        this.selectedAll = this.allFilterdTickets.every(function (item: any) {
            return item.selected == true;
        })
    }
    sortable(name) {
        this.customer.sortField = name;
        this.customer.isAsc = !this.customer.isAsc;
    }
    
    searchItem() {
        this.unSelectAll();
    }
}
