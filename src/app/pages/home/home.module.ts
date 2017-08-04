import { HomeService } from './home.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TablesModule } from '../tables/tables.module';
import { Routes, Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NgaModule } from '../../theme/nga.module';

import { HomeComponent } from './home.component';
import { homeRouting } from './home.routing';
import { AppTranslationModule } from '../../app.translation.module';

@NgModule({
    declarations: [HomeComponent, DashboardComponent],
    imports: [homeRouting, NgaModule, CommonModule, Ng2SmartTableModule],
    providers: [HomeService],
})
export class HomeModule {

}
