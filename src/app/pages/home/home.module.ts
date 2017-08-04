import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard';
import { TablesModule } from '../tables/tables.module';
import { Routes, Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NgaModule } from '../../theme/nga.module';

import { HomeComponent } from './home.component';
import { homeRouting } from './home.routing';
import { DashboardService } from './components/dashboard/dashboard.service';
import { AppTranslationModule } from '../../app.translation.module';

@NgModule({
    declarations: [HomeComponent, DashboardComponent],
    imports: [homeRouting, NgaModule, CommonModule],
    providers: [DashboardService],
})
export class HomeModule {

}
