import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgaModule } from '../../theme/nga.module';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CustomerMaintenanceComponent } from './components/customer-maintenance/customer-maintenance.component';
import { CreateRequestComponent } from './components/create-request/create-request.component';
import { NgModule } from '@angular/core';
const routes: Routes = [
    {
        path: '',
        component: CustomerMaintenanceComponent,
    },
];


@NgModule({
    declarations: [CustomerMaintenanceComponent,CreateRequestComponent],
    imports: [CommonModule, RouterModule.forChild(routes), NgaModule, CommonModule, FormsModule, NgbModule, SharedModule],
})
export class CustomerMaintenanceModule {

}
