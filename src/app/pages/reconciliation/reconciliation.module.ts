import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Routes, RouterModule } from '@angular/router';
import { ReconciliationComponent } from './components/reconciliation/reconciliation.component';
import { NgModule, Provider } from '@angular/core';
import { ReconciliationService } from './reconciliation.service';

import { FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: ReconciliationComponent,
    },
];


@NgModule({
    declarations: [ReconciliationComponent],
    imports: [Ng2SmartTableModule, RouterModule.forChild(routes), FormsModule, CommonModule, NgaModule],
    providers: [ReconciliationService],
})
export class ReconciliationModule {

}
