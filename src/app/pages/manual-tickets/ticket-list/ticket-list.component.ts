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

    // allbranches related to loggen in usr
    allBranches: Branch;

    // logged in user
    user: User;

    allTickets: any[];

    constructor(
        protected service: ManualTicketService,
        protected userService: UserService,
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
        this.service.getTickets(this.user.UserId).subscribe((response) => {
            this.allTickets = response;
        });
    }

    getBranches() {
        this.service.getBranches(this.user.UserId).subscribe((response) => {
            this.allBranches = response;
        });
    }
}
