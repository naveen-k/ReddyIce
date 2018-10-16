import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './components/report-management/reports.component';
import { NgModule } from '@angular/core';
import { SafeUrlPipe } from './pipes/safeurl.pipe';
import { ReportService } from './reports.service';
const routes: Routes = [
    {
        path: '',
        component: ReportsComponent,
    },
];


@NgModule({
    declarations: [ReportsComponent,SafeUrlPipe],
    imports: [CommonModule, RouterModule.forChild(routes), NgaModule, CommonModule, FormsModule, NgbModule, SharedModule],
    providers: [ReportService],
})
export class ReportsModule {

}
