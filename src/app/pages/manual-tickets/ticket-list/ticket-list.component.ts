import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { User } from '../../user-management/user-management.interface';
import { Branch } from '../../../shared/interfaces/interfaces';
import { UserService } from '../../../shared/user.service';
import { ManualTicketService } from '../manual-ticket.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
@Component({
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.scss'],
})
export class TicketListComponent implements OnInit {
    newWindow: any;
    showSpinner: boolean = false;

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
    // dateFormat = ((date: NgbDateStruct) =>{debugger; return `${date.month}/${date.day}/${date.year}`});

    constructor(
        protected service: ManualTicketService,
        protected userService: UserService,
        protected notificationService: NotificationsService,
        protected activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
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

        if (!this.user.IsDistributor && this.user.Branch && this.user.Branch.BranchID !== 1 && !this.searchObj.BranchId) {
            this.searchObj.BranchId = this.user.Branch.BranchID;
        }

        if (this.user.Distributor && this.user.Distributor.DistributorMasterId && !this.searchObj.DistributorID) {
            this.searchObj.DistributorID = this.user.Distributor.DistributorMasterId;
        }

        // Set first branch default selected
        if (this.searchObj.BranchId) {
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
        if (this.searchObj.BranchId === null) {
            return;
        }
        this.showSpinner = true;
        this.service.getDriverByBranch(this.searchObj.BranchId, this.searchObj.userType === 'Internal').subscribe(res => {
            res = res || [];
            if (this.user.Role && (this.user.Role.RoleID < 3 || this.user.Role.RoleID == 4 || this.user.Role.RoleID == 7)) {
                res.unshift({ 'UserId': 1, 'FirstName': 'All', 'LastName': 'Drivers' });
                this.searchObj.UserId = +this.searchObj.UserId || 1;
            }
            this.drivers = res;
            this.showSpinner = false;
            this.getSearchedTickets(byType);
        });
    }

    getDistributors(byType: any = '') {
        this.service.getDistributerAndCopacker().subscribe(res => {
            this.distributors = this.service.transformOptionsReddySelect(res, 'DistributorCopackerID', 'Name');
            this.getSearchedTickets(byType);
        });
    }

    branchChangeHandler(byType: any = '') {
        //this.searchObj.UserId = null;
        this.getDrivers(byType);
    }
    dateChangeHandler() {
        this.searchObj.UserId = null;
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
                //debugger;
                if (response) {
                    this.showSpinner = false;
                    if (response == 'No record found') {
                        this.allTickets = [];
                        this.allTicketsTemp = [];
                    } else {
                        response.forEach(element => {
                            element['ticketType'] = this.service.getTicketType(element.IsSaleTicket, element.Customer, element.TicketTypeID)
                        });
                        this.allTickets = response;
                        this.allTicketsTemp = response;
                        this.ticketTotal();

                    }
                }
            },
                (error) => {
                    if (error) {
                        this.showSpinner = false;
                        this.allTickets = [];
                    }
                },
            );
        } else {
            this.allTickets = this.allTicketsTemp;
            this.allTickets.forEach(element => {
                element['ticketType'] = this.service.getTicketType(element.IsSaleTicket, element.Customer, element.TicketTypeID)
            });
            this.showSpinner = false;

            this.ticketTotal();

        }
    }
    ticketTotal() {
        this.allTickets.forEach(ticket => {
            this.total.totalDistAmt += ticket.DistAmt || 0; ticket.CustomerName = ticket.Customer.CustomerName;
            ticket.CustomerNumber = ticket.Customer.CustomerNumber;
            ticket.CustomerTitle = ticket.Customer.CustomerNumber + " - " + ticket.Customer.CustomerName;
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
        this.searchObj.UserId = null;
        this.searchObj.DistributorID = 0;
        if (this.searchObj.userType === 'External') {
            this.searchObj.BranchId = null;
            this.getDistributors(byType);
        } else {

            this.getDrivers(byType);
        }
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
                }
            },
            (error) => {
                if (error) {
                    this.notificationService.error(error._body);
                }
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
}
