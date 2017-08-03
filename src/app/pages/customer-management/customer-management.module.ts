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
    imports: [RouterModule.forChild(routes)],
})
export class CustomerManagementModule {

}
