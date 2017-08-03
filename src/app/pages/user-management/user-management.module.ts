import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { DataFilterPipe } from './components/user-management/data-filter.pipe';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { NgModule, Provider } from '@angular/core';
import { UserTablesService } from './user-management.service';

import { FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: UserManagementComponent,
    },
];


@NgModule({
    declarations: [UserManagementComponent, DataFilterPipe],
    imports: [Ng2SmartTableModule, RouterModule.forChild(routes), FormsModule, CommonModule, NgaModule],
    providers: [UserTablesService],
})
export class UserManagementModule {

}
