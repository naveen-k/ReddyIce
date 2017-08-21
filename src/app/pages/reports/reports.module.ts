import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './components/report-management/reports.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: ReportsComponent,
    },
];


@NgModule({
    declarations: [ReportsComponent],
    imports: [Ng2SmartTableModule, RouterModule.forChild(routes), NgaModule, CommonModule, FormsModule, NgbModule],
})
export class ReportsModule {

}
