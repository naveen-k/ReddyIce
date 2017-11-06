import { UserService } from '../../shared/user.service';
import { ManualTicketService } from './manual-ticket.service';

import { Component } from '@angular/core';

@Component({
  template: '<router-outlet></router-outlet>',
})

export class ManualTicketComponent {
  constructor(manualTicketService: ManualTicketService, userService: UserService) {
    const now = new Date();
    let searchObject = manualTicketService.getSearchedObject();
    searchObject.CreatedDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    searchObject.userType = userService.getUser().IsDistributor ? 'External' : 'Internal';
    searchObject.UserId = userService.getUser().UserId;
    searchObject.BranchId = null;
    searchObject.DistributorID = null;
  }
}
