import { UserService } from '../../shared/user.service';
import { LoadService } from './load.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class BranchResolver implements Resolve<any[]> {
    constructor(
        private service: LoadService,
        private user: UserService,
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ) {
        return this.service.getBranches(this.user.getUser().UserId);
    }
}

