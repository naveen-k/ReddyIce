import { CustomerTypeToNamePipe } from './pipes/customer-type.pipe';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CustomerManagementService } from './customer-management.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { CreateCustomerComponent } from './components/create-customer/create-customer.component';
import { NgaModule } from '../../theme/nga.module';
import { Routes, RouterModule } from '@angular/router';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';
import { NgModule } from '@angular/core';
import { CustomerContainerComponent } from './components/customer-management-container/customer-management-container.component';
import { SetPriceComponent } from './components/set-generic-price/setprice.component';

const routes: Routes = [
    {
        path: '',
        component: CustomerContainerComponent,
        children: [{
            path: 'list',
            component: CustomerManagementComponent,
        },
        {
            path: 'create',
            component: CreateCustomerComponent,
            data: {
                mode: 1,
            },
        },
        {
            path: 'edit/:customerId',
            component: CreateCustomerComponent,
            data: {
                mode: 2,
            },
        },
        {
            path: 'view/:customerId',
            component: CreateCustomerComponent,
            data: {
                mode: 3,
            },
        },
        {
            path: 'set-price',
            component: SetPriceComponent,
        },
        {
            path: '', redirectTo: 'list', pathMatch: 'full',
        }],
    },
];


@NgModule({
    declarations: [CustomerManagementComponent, CreateCustomerComponent, CustomerContainerComponent, SetPriceComponent, CustomerTypeToNamePipe],
    imports: [SharedModule, RouterModule.forChild(routes), NgaModule, CommonModule, FormsModule, NgbModule],
    providers: [CustomerManagementService],
})
export class CustomerManagementModule {

}
