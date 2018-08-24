import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Routes, RouterModule } from '@angular/router';
import { LookupComponent } from './components/lookup-management/lookup.component';
import { CreateLookupComponent } from './components/create-lookup/create-lookup.component';
import { NgModule } from '@angular/core';
import { LookupService } from './lookup.service';
//import { ReportService } from './reports.service';
const routes: Routes = [
    {
        path: '',
        component: LookupComponent,
    },
];


@NgModule({
    declarations: [LookupComponent, CreateLookupComponent],
    imports: [CommonModule, RouterModule.forChild(routes), NgaModule, CommonModule, FormsModule, NgbModule, SharedModule],
    providers: [LookupService],
})
export class LookupModule {

}
