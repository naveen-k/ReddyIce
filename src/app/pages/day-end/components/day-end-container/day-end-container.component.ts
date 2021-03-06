import { UserService } from '../../../../shared/user.service';
import { DayEndService } from '../../day-end.service';
import { Component } from '@angular/core';
@Component({
    template: `<router-outlet></router-outlet>`,
})
export class DayEndContainerComponent {
    constructor(service: DayEndService, user: UserService) {
        let filter = service.getFilter();
        const now = new Date();

        filter.selectedDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        filter.userBranch = user.getUser().Branch ? user.getUser().Branch.BranchID : null;

        const logedInUser = user.getUser();
        if (logedInUser.IsDistributor) {
            filter.type = 'distributor';
            filter.userBranch = logedInUser.Distributor.DistributorMasterId || logedInUser.Distributor.DistributorMasterID;
        } else {
            filter.type = 'internal';
        }
        if (logedInUser.Role.RoleID === 3 && logedInUser.IsSeasonal) {
            filter.type = 'internal';
        }
    }
}
