import { SharedModule } from '../shared/shared.module';
import { DASHBOARD_PIPE } from './pages.pipes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Pages } from './pages.component';
import { AuthGuard } from './auth-guard.service';
import { LoginService } from './login/login.service';



@NgModule({
  imports: [CommonModule, AppTranslationModule, NgbModule, NgaModule, routing, SharedModule],
  declarations: [Pages, DASHBOARD_PIPE],
  providers: [AuthGuard, LoginService],
})
export class PagesModule {
}
