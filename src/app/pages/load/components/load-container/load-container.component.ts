import { UserService } from '../../../../shared/user.service';
import { LoadService } from '../../load.service';
import { Component } from '@angular/core';
@Component({
    template: `<router-outlet></router-outlet>`,
})
export class LoadContainerComponent {
    constructor(service: LoadService, user: UserService) {
        let filter = service.getFilter();
        const now = new Date();
        
        filter.selectedDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        filter.userBranch = user.getUser().Branch ? user.getUser().Branch.BranchID : null;
        //filter.userDriver = localStorage.getItem('userId') || '';
    }
}
