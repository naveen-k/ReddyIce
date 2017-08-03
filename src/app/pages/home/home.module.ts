import { HomeComponent } from './';
import { DashboardComponent } from './components/dashboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NgaModule } from '../../theme/nga.module';

import { homeRouting } from './home.routing';
import { DashboardService } from './components/dashboard/dashboard.service';
import { AppTranslationModule } from '../../app.translation.module';

const routes: Routes = [{ path: '', component: HomeComponent }];


@NgModule({
   imports: [
    CommonModule,
    AppTranslationModule,
    FormsModule,
    NgaModule,
    homeRouting,

  ],
  declarations: [
    HomeComponent,
    DashboardComponent,
  ],
  providers: [
    DashboardService,
  ]
})
export class HomeModule {

}
