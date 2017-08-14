import { SharedModule } from '../../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { DataFilterPipe } from './components/user-management/data-filter.pipe';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { NgModule, Provider } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { CreateUserComponent } from './components/create-user/create-user.component';

import { FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: UserManagementComponent,
    },
];


@NgModule({
    declarations: [UserManagementComponent, DataFilterPipe, CreateUserComponent],
    imports: [SharedModule, Ng2SmartTableModule, RouterModule.forChild(routes), FormsModule, CommonModule, NgaModule],
    providers: [UserManagementService],
})
export class UserManagementModule {

}
