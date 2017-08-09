import { DASHBOARD_PIPE } from './pages.pipes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Pages } from './pages.component';

@NgModule({
  imports: [CommonModule, AppTranslationModule, NgbModule, NgaModule, routing],
  declarations: [Pages, DASHBOARD_PIPE]
})
export class PagesModule {
}
