import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './components/inventory-management/inventory.component';
import { NgModule } from '@angular/core';
//import { ReportService } from './reports.service';
const routes: Routes = [
    {
        path: '',
        component: InventoryComponent,
    },
];


@NgModule({
    declarations: [InventoryComponent],
    imports: [CommonModule, RouterModule.forChild(routes), NgaModule, CommonModule, FormsModule, NgbModule, SharedModule],
    providers: [],
})
export class InventoryModule {

}
