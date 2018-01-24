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
import { GenericFilter } from 'app/shared/pipes/generic-filter.pipe';
import { GenericSort } from 'app/shared/pipes/generic-sort.pipe';
@Component({
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.scss'],
    providers: [TicketFilter, GenericFilter, GenericSort]
})
export class TicketListComponent implements OnInit {
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
    searchObj: any = {};

    drivers: any[];

    distributors: any[];

    todaysDate: any;

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
        private genericSort: GenericSort
    ) { }

    ngOnInit() {
        this.EDIUserName = environment.EDIUserName;
        const userId = localStorage.getItem('userId') || '';
        this.userService.getUserDetails(userId).subscribe((response) => {
            this.isDistributorExist = response.IsDistributor;
            this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + response.Distributor.DistributorName : '';
        });
        this.searchObj = this.service.getSearchedObject();
        //this.searchObj.BranchId = 1;
        const now = new Date();
        this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

        // Get loggedIn user details
        this.user = this.userService.getUser();


        // load all branches
        let branches = this.activatedRoute.snapshot.data['branches'];
        // Remove 'All branch' object
        if (branches && branches.length && this.user.Role.RoleID === 3) {
            if ((branches.length > 0) && (branches[0] === null || branches[0].BranchID === 1)) {
                branches.shift();
                this.sortBranches(branches);
            }
        }

        this.allBranches = this.service.transformOptionsReddySelect(branches, 'BranchID', 'BranchCode', 'BranchName');
        if (this.searchObj.userType !== 'External' && this.searchObj.UserId < 1 && this.searchObj.BranchId < 1 && this.allBranches && this.allBranches.length > 0 && +this.allBranches[0].value == 1) {
            this.searchObj.BranchId = 1;
        }
        if (!this.user.IsDistributor && this.user.Branch && (this.user.Branch.BranchID && this.user.Branch.BranchID !== 1) && this.searchObj.BranchId <= 1) {
            this.searchObj.BranchId = this.user.Branch.BranchID;
        }

        if (this.user.IsDistributor && this.user.Distributor.DistributorMasterId && this.searchObj.DistributorID <= 1) {
            this.searchObj.DistributorID = this.user.Distributor.DistributorMasterId;
        }

        // Set first branch default selected

        if (this.searchObj.BranchId && this.searchObj.BranchId > 0) {
            this.branchChangeHandler();
        } else if (this.searchObj.DistributorID) {
            this.getDistributors();
            // this.getSearchedTickets();
        } else {
            this.getSearchedTickets();
        }
    }

    sortBranches(branches) {
        // sort by name
        branches.sort(function (a, b) {
            const nameA = a.BranchName.toUpperCase(); // ignore upper and lowercase
            const nameB = b.BranchName.toUpperCase(); // ignore upper and lowercase
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

    getDrivers(byType: any = '') {
        if (this.searchObj.BranchId === -1) {
            return;
        }

        this.showSpinner = true;
        this.service.getDriverByBranch(this.searchObj.BranchId, this.searchObj.userType === 'Internal').subscribe(res => {
            res = res || [];
            if (this.user.Role && (this.user.Role.RoleID < 3 || this.user.Role.RoleID == 4 || this.user.Role.RoleID == 7)) {
                res.unshift({ 'UserId': 1, 'FirstName': 'All', 'LastName': 'Drivers' });

                this.searchObj.UserId = (+this.searchObj.UserId > 0) ? +this.searchObj.UserId : -1;
            }
            this.drivers = this.service.transformOptionsReddySelect(res, 'UserId', 'FirstName', 'LastName');
            if ((byType == 'yes' || (+this.searchObj.BranchId == 1 && this.searchObj.UserId < 1)) && this.drivers && this.drivers.length > 0 && +this.drivers[0].value == 1) {
                this.searchObj.UserId = 1;
            }
            this.showSpinner = false;
            this.getSearchedTickets(byType);
        });
    }

    getDistributors(byType: any = '') {
        if (this.distributorsCache.length == 0) {
            this.service.getDistributerAndCopacker().subscribe(res => {
                this.distributors = this.service.transformOptionsReddySelect(res, 'DistributorCopackerID', 'Name');
                this.distributorsCache = this.distributors;
                this.getSearchedTickets(byType);
            });
        } else {
            this.distributors = this.distributorsCache;
            this.getSearchedTickets(byType);
        }
    }

    branchChangeHandler(byType: any = '') {
        this.getDrivers(byType);

    }
    dateChangeHandler() {
        if (this.searchObj.UserId < 1 && this.drivers && this.drivers.length > 0 && +this.drivers[0].value == 1) {
            this.searchObj.UserId = 1;
        }
        this.getSearchedTickets();
    }
    getSearchedTickets(byType: any = '') {
        // Cloned search object
        const searchObj = JSON.parse(JSON.stringify(this.searchObj));
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
        this.showSpinner = true;
        if (searchObj.userType == 'External') { searchObj.BranchId = null; }
        if (byType !== 'byuser') {
            return this.service.getAllTickets(dt, searchObj.BranchId).subscribe((response: any) => {
                if (response) {
                    this.showSpinner = false;
                    if (response == 'No record found') {
                        this.allTickets = [];
                        this.allTicketsTemp = [];
                        this.allFilterdTickets = [];
                        this.unSelectAll();
                    } else {
                        response.forEach(element => {
                            element['ticketType'] = this.service.getTicketType(element.IsSaleTicket, element.Customer, element.TicketTypeID, element.CustomerTypeID, element.UserName ? (element.UserName.replace(/\s/g, "").replace(/-+/g, '') == this.EDIUserName) : false)
                        });
                        this.allTickets = response;
                        this.allTicketsTemp = response;
                        this.allFilterdTickets = this.getFilteredAllTicket();
                        this.unSelectAll();
                        this.ticketTotal();

                    }
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
        } else {
            this.allTickets = this.allTicketsTemp;
            this.allFilterdTickets = this.getFilteredAllTicket();
            this.unSelectAll();
            this.allTickets.forEach(element => {
                element['ticketType'] = this.service.getTicketType(element.IsSaleTicket, element.Customer, element.TicketTypeIDelement, element.CustomerTypeID, element.UserName ? (element.UserName.replace(/\s/g, "").replace(/-+/g, '') == this.EDIUserName) : false)
            });
            this.showSpinner = false;

            this.ticketTotal();

        }

    }
    ticketTotal() {
        this.allTickets.forEach(ticket => {
            this.total.totalDistAmt += ticket.DistAmt || 0; ticket.CustomerName = ticket.Customer.CustomerName;
            ticket.AXCustomerNumber = ticket.Customer.AXCustomerNumber;
            ticket.CustomerTitle = ticket.Customer.AXCustomerNumber + " - " + ticket.Customer.CustomerName;
            ticket.TotalSaleWithTax = (ticket.TotalSale || 0) + (ticket.TaxAmount || 0);
        });
    }
    // approve all checked tickets
    approveCheckedTickets() {
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

        this.createMultiTicketApprovalObject(selectedIds);
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
                    this.getSearchedTickets();  // in order to refresh the list after ticket status change
                }
            },
            (error) => {
                if (error) {
                    this.notificationService.error('Error', JSON.parse(error._body));
                }
            },
        );
    }

    typeChangeHandler(byType: any = '') {
        // if (!this.searchObj.BranchId) {
        //     return;
        // }
        this.searchObj.UserId = -1;
        this.searchObj.DistributorID = -1;
        if (this.searchObj.userType === 'External') {
            this.searchObj.BranchId = -1;
            this.getDistributors(byType);
        } else {
            if (this.searchObj.BranchId < 1 && this.allBranches && this.allBranches.length > 0 && +this.allBranches[0].value == 1) {
                this.searchObj.BranchId = 1;
            }
            this.branchChangeHandler(byType);
        }
        this.allFilterdTickets = this.getFilteredAllTicket();
        this.unSelectAll();
    }

    userChangeHandler(byType: any = '') {
        this.getSearchedTickets(byType);
    }

    // delete ticket in the draft state
    deleteTicket(ticketNumber) {
        this.service.deleteDraftTicket(ticketNumber).subscribe(
            (response) => {
                if (response) {
                    this.notificationService.success('Ticket deleted successfully');
                    this.getSearchedTickets();
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
    showTicketChoice(ticketNumber, mode) {
        this.overlayStatus = true;
        this.service.getSaleCreditTicket(ticketNumber).subscribe(
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
                                            this.getSearchedTickets();
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

    getFilteredAllTicket() {
        let filterData = [];
        filterData = this.ticketFilter.transform(this.allTickets, this.searchObj.userType, (this.searchObj.userType === 'Internal') ? this.searchObj.UserId : this.searchObj.DistributorID);

        filterData = this.genericFilter.transform(filterData, this.searchString, this.searchColumn);

        filterData = this.genericSort.transform(filterData, this.customer.sortField, this.customer.isAsc);

        return filterData;
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
    searchItem() {
        this.unSelectAll();
    }
}
