import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CustomerManagementService } from './customer-management.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import { NgaModule } from '../../theme/nga.module';
import { Routes, RouterModule } from '@angular/router';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: CustomerManagementComponent,
    },
];


@NgModule({
    declarations: [CustomerManagementComponent],
    imports: [SharedModule, RouterModule.forChild(routes), NgaModule, CommonModule, FormsModule, NgbModule],
    providers: [CustomerManagementService],
})
export class CustomerManagementModule {

}
