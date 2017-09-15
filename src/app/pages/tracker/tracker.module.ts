import { TrackerService } from './tracker.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TrackerComponent } from './components/tracker.component';
import { SharedModule } from '../../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
// import { DataFilterPipe } from './components/user-management/data-filter.pipe';
import { Routes, RouterModule } from '@angular/router';

import { NgModule, Provider } from '@angular/core';

import { FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: TrackerComponent,
    },
];


@NgModule({
    declarations: [TrackerComponent],
    imports: [
        SharedModule, 
        Ng2SmartTableModule, 
        RouterModule.forChild(routes), 
        FormsModule, 
        CommonModule, 
        NgaModule,
        NgbModule,
    ],
    providers: [
        TrackerService,
    ],
})
export class TrackerModule {

}
