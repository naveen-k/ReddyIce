import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './components/report-management/reports.component';
import { NgModule } from '@angular/core';
import { ReportService } from './reports.service';
const routes: Routes = [
    {
        path: '',
        component: ReportsComponent,
    },
];


@NgModule({
    declarations: [ReportsComponent],
    imports: [CommonModule, RouterModule.forChild(routes), NgaModule, CommonModule, FormsModule, NgbModule],
    providers: [ReportService],
})
export class ReportsModule {

}
