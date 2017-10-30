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

    showSpinner: boolean = false;

    // allbranches related to loggen in usr
    allBranches: Array<any>;

    // logged in user
    user: User = {} as User;

    allTickets: any = [];

    // model search
    searchObj: any = {};

    drivers: any[];

    distributors: any[];

    todaysDate: any;

    disableApprove: boolean = true;

    searchString: any;
    isDistributorExist: boolean;
    userSubTitle: string = '';

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

        const now = new Date();
        this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

        // Get loggedIn user details
        this.user = this.userService.getUser();


        // load all branches
        let branches = this.activatedRoute.snapshot.data['branches'];
        // Remove 'All branch' object
        if (branches.length && branches[0].value === 1) {
            branches.shift();
            this.sortBranches(branches);
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
        }

        if (this.searchObj.DistributorID) {
            this.getDistributors();
            // this.getSearchedTickets();
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

    getDrivers() {
        this.service.getDriverByBranch(this.searchObj.BranchId, this.searchObj.userType === 'Internal').subscribe(res => {
            res = res || [];
            if (this.user.Role && this.user.Role.RoleID <= 2) {
                res.unshift({ 'UserId': 1, 'FirstName': 'All', 'LastName': 'Drivers' });
                this.searchObj.UserId = +this.searchObj.UserId || 1;
            }
            this.drivers = res;
            this.getSearchedTickets();
        });
    }

    getDistributors() {
        this.service.getDistributerAndCopacker().subscribe(res => {
            this.distributors = this.service.transformOptionsReddySelect(res, 'DistributorCopackerID', 'Name');
            this.getSearchedTickets();
        });
    }

    branchChangeHandler() {
        this.getDrivers();
    }

    getSearchedTickets() {
        // Cloned search object
        const searchObj = JSON.parse(JSON.stringify(this.searchObj));
        const dt = `${searchObj.CreatedDate.month}-${searchObj.CreatedDate.day}-${searchObj.CreatedDate.year}`;

        this.showSpinner = true;
        if (searchObj.userType == 'External') { searchObj.BranchId = null; }
        return this.service.getAllTickets(dt, searchObj.BranchId).subscribe((response: any) => {
            if (response) {
                this.showSpinner = false;
                if (response == 'No record found') {
                    this.allTickets = [];
                } else {
                    response.forEach(element => {
                        element['ticketType'] = this.service.getTicketType(element.IsSaleTicket, element.Customer, element.TicketTypeID)
                    });
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

    typeChangeHandler() {
        // if (!this.searchObj.BranchId) {
        //     return;
        // }
        if (this.searchObj.userType === 'External') {
            this.getDistributors();
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
            window.open(environment.reportEndpoint + "?Rtype=TK&TicketID=" + ticketID, "Ticket", "width=900,height=600");
        } else {
            this.notificationService.error("Ticket preview unavailable!!");
        }
    }
}
