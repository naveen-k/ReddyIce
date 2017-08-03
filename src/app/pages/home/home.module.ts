import { TablesModule } from '../tables/tables.module';
import { Routes, Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NgaModule } from '../../theme/nga.module';

import { HomeComponent } from './home.component';
import { homeRouting } from './home.routing';
import { DashboardService } from './components/dashboard/dashboard.service';
import { AppTranslationModule } from '../../app.translation.module';

const routes: Routes = [{ path: '', component: HomeComponent }];


@NgModule({
    declarations: [HomeComponent],
    imports: [TablesModule, RouterModule.forChild(routes)],
})
export class HomeModule {

}
