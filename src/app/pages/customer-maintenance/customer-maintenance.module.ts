import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgaModule } from '../../theme/nga.module';
import { CommonModule } from '@angular/common';
import { CustomerMaintenanceComponent } from './components/customer-maintenance/customer-maintenance.component';
import { CreateRequestComponent } from './components/create-request/create-request.component';
import { NgModule } from '@angular/core';
import { routing } from './customer-maintenance.routing';
import { CustomerMaintenancePageComponent } from './customer-maintenance-component';

@NgModule({
    declarations: [CustomerMaintenancePageComponent,CustomerMaintenanceComponent,CreateRequestComponent],
    imports: [CommonModule, routing, NgaModule, CommonModule, FormsModule, NgbModule, SharedModule]
})
export class CustomerMaintenanceModule { }
