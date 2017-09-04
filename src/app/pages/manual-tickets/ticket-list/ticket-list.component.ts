import { NotificationsService } from 'angular2-notifications/dist';
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
    model: any = {};
    showSpinner: boolean = true;

    // allbranches related to loggen in usr
    allBranches: Branch;

    // logged in user
    user: User;

    allTickets: any = [];

    // array with all the checked ticket numbers
    ticketIdArray = [];

    // array with all duplicate items removed
    filteredArray = [];

    // dummy ticketObject
    ticketObject = {
        TicketID: [
            1, 2,
        ],
        status: 1,
    };

    // dummy searchObject
    searchObj = {
        CreatedDate: '2017-08-01',
        BranchId: 0,
        IsForAll: false,
    };

    branch: any;
    ticketDate: any = '';

    constructor(
        protected service: ManualTicketService,
        protected userService: UserService,
        protected notificationService: NotificationsService,
    ) { }

    ngOnInit() {
        // Get loggedIn user details
        this.user = this.userService.getUser();

        // load all branches
        this.getBranches();

        // load all tickets
        this.getAllTickets();
    }

    getAllTickets() {
        this.showSpinner = true;
        return this.service.getTickets(this.searchObj).subscribe((response) => {
            if (response) {
                console.log("if response is successful", response);
                this.showSpinner = false;
                this.allTickets = response;
            }
        },
            (error) => {
                if (error) {
                    console.log("if response is unsuccessful", error);
                    this.showSpinner = false;
                    this.allTickets = [];
                }
            },
        );
    }

    getSearchedTickets() {
        return this.service.getAllTickets(this.searchObj.CreatedDate,
            this.searchObj.BranchId, this.searchObj.IsForAll, this.user.UserId).subscribe((response: any) => {
            if (response) {
                console.log("if response is successful", response);
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
                    console.log("if response is unsuccessful", error);
                    this.showSpinner = false;
                    this.allTickets = [];
                }
            },
        );
    }

    getBranches() {
        this.service.getBranches(this.user.UserId).subscribe((response) => {
            this.allBranches = response;
            this.branch = '1';
        });
    }

    getSelectedDate(selectedDate) {
        this.searchObj.CreatedDate = this.service.formatDate(selectedDate);
        this.getSearchedTickets();
    }

    getSelectedBranch(branch) {
        this.searchObj.BranchId = branch;
        this.getSearchedTickets();
    }

    getSelectedTicketType(type) {
        this.searchObj.IsForAll = type;
        this.getSearchedTickets();
    }

    // called on checkbox selection to approve single/ multiple tickets
    onChecked(event, item) {
        // perform action if checkbox is selected only
        if (event.target.checked) {
            this.ticketIdArray.push(item.TicketID);
        }
    }

    // approve all checked tickets
    approveCheckedTickets() {
        this.filterTicketIdArray();         // remove duplicate items from the array
    }

    // remove duplicate items from the array before object creation
    filterTicketIdArray() {
        for (var i = 0; i < this.ticketIdArray.length; i++) {
            if (this.filteredArray.indexOf(this.ticketIdArray[i]) === -1) {
                this.filteredArray.push(this.ticketIdArray[i]);
            }
        }
        this.createMultiTicketApprovalObject();
    }

    // create object to approve single/multiple tickets
    createMultiTicketApprovalObject() {
        this.ticketObject.TicketID = this.filteredArray;
        this.ticketObject.status = 25;

        // call workflow service to approve all the checked ticket numbers
        this.service.approveAllCheckedTickets(this.ticketObject).subscribe(
            (response) => {
                if (response) {
                    this.notificationService.success('Success', JSON.parse(response._body).Message);
                }
            },
            (error) => {
                if (error) {
                    this.notificationService.error('Error', JSON.parse(error._body).Message);
                }
            },
        );
    }
}
