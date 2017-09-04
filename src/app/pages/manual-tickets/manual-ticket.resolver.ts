import { UserService } from '../../shared/user.service';
import { ManualTicketService } from './manual-ticket.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class BranchResolver implements Resolve<any[]> {
    constructor(
        private service: ManualTicketService,
        private user: UserService,
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) {
        return this.service.getBranches(this.user.getUser().UserId);
    }
}

@Injectable()
export class TicketTypesResolver implements Resolve<any> {
    constructor(
        private service: ManualTicketService,
    ) {}

    resolve() {
        return this.service.getTicketTypes();
    }
}
