import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { User } from '../../user-management/user-management.interface';
import { Branch } from '../../../shared/interfaces/interfaces';
import { UserService } from '../../../shared/user.service';
import { ManualTicketService } from '../manual-ticket.service';
import { Component, OnInit } from '@angular/core';
@Component({
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.scss'],
})
export class TicketListComponent implements OnInit {

    showSpinner: boolean = false;

    // allbranches related to loggen in usr
    allBranches: Branch[];

    // logged in user
    user: User = {} as User;

    allTickets: any = [];

    // model search
    searchObj: any = {};

    drivers: any[];

    distributors: any[];

    todaysDate: any;

    // dateFormat = ((date: NgbDateStruct) =>{debugger; return `${date.month}/${date.day}/${date.year}`});

    constructor(
        protected service: ManualTicketService,
        protected userService: UserService,
        protected notificationService: NotificationsService,
        protected activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.searchObj = this.service.getSearchedObject();

        const now = new Date();
        this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

        // Get loggedIn user details
        this.user = this.userService.getUser();

        // load all branches
        this.allBranches = this.activatedRoute.snapshot.data['branches'];

        // Remove 'All branch' object
        if (this.allBranches[0].BranchID === 1) {
            this.allBranches.shift();
        }

        // Set first branch default selected
        if (this.searchObj.BranchId) {
            this.branchChangeHandler();
        }

    }

    getDrivers() {
        this.service.getDriverByBranch(this.searchObj.BranchId, this.searchObj.userType === 'Internal').subscribe(res => {
            res = res || [];
            res.unshift({ 'UserId': 1, 'FirstName': 'All', 'LastName': 'Drivers' });
            this.drivers = res;
            this.searchObj.UserId = 1;
            this.getSearchedTickets();
        });
    }

    getDistributors(branchId) {
        this.service.getDistributorsByBranch(branchId.toString()).subscribe(res => {
            this.distributors = res;
            this.getSearchedTickets();
        });
    }

    branchChangeHandler() {
        if (this.searchObj.userType === 'Internal') {
            this.getDrivers();
        } else {
            this.getDistributors(this.searchObj.BranchId);
        }
    }

    getSearchedTickets() {
        // Cloned search object
        const searchObj = JSON.parse(JSON.stringify(this.searchObj));
        const dt = `${searchObj.CreatedDate.month}-${searchObj.CreatedDate.day}-${searchObj.CreatedDate.year}`;

        this.showSpinner = true;

        // TODO- to check with nikhil/naveen, what to send incase of distributor selected
        return this.service.getAllTickets(dt, searchObj.BranchId, 878).subscribe((response: any) => {
            if (response) {
                this.showSpinner = false;
                if (response === 'No Record Found') {
                    this.allTickets = [];
                } else {
                    this.allTickets = response;
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
                }
            },
            (error) => {
                if (error) {
                    this.notificationService.error('Error', JSON.parse(error._body).Message);
                }
            },
        );
    }

    typeChangeHandler() {
        if (!this.searchObj.BranchId) {
            return;
        }
        if (this.searchObj.userType === 'External') {
            this.getDistributors(this.searchObj.BranchId);
        } else {
            this.getDrivers();
        }
    }

    userChangeHandler() {
        this.getSearchedTickets();
    }

    // delete ticket in the draft state
    deleteTicket(ticketNumber) {
        this.service.deleteDraftTicket(ticketNumber).subscribe(
            (response) => {
                if (response) {
                    this.notificationService.success('Ticket deleted successfully');
                }
            },
            (error) => {
                if (error) {
                    this.notificationService.error(error._body);
                }
            },
        );
    }
}
