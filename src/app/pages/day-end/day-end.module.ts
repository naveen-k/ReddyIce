import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Routes, RouterModule } from '@angular/router';
import { DayEndComponent } from './components/day-end/day-end.component';
import { NgModule, Provider } from '@angular/core';
import { DayEndService } from './day-end.service';

import { FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: DayEndComponent,
    },
];


@NgModule({
    declarations: [DayEndComponent],
    imports: [
        Ng2SmartTableModule,
        RouterModule.forChild(routes), 
        FormsModule, 
        CommonModule, 
        NgaModule,
        NgbModule,
        SharedModule,
    ],
    providers: [DayEndService],
})
export class DayEndModule {

}
