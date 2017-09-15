import { UserService } from '../../../../shared/user.service';
import { CustomerManagementService } from '../../customer-management.service';
import { Component } from '@angular/core';
@Component({
    template: `<router-outlet></router-outlet>`,
})

export class CustomerContainerComponent {
    constructor(service: CustomerManagementService, user: UserService) {
       
    }
}
