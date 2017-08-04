import { CustomerManagementService } from './customer-management.service';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '../forms/forms.module';
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
    imports: [Ng2SmartTableModule, RouterModule.forChild(routes), NgaModule, CommonModule],
    providers: [CustomerManagementService],
})
export class CustomerManagementModule {

}
