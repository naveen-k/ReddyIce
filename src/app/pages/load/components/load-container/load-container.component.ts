import { UserService } from '../../../../shared/user.service';
import { LoadService } from '../../load.service';
import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
@Component({
    template: `<router-outlet></router-outlet>`,
})
export class LoadContainerComponent {
    constructor(service: LoadService, user: UserService,
        protected activatedRoute: ActivatedRoute,protected router: Router,
        protected notification: NotificationsService) {
           
        if(!user.getUser().IsRIInternal){
            this.notification.error('', 'You are not authorized to access this module.');
            this.router.navigate(['/pages']);
        }
        let filter = service.getFilter();
        const now = new Date();
        
        filter.selectedDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        //filter.userBranch = user.getUser().Branch ? user.getUser().Branch.BranchID : null;
        //filter.userDriver = localStorage.getItem('userId') || '';
		filter.userBranch = 0;
    }
}
