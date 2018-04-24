import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';



@NgModule({
  imports: [CommonModule, AppTranslationModule, routing, SharedModule],
  declarations: [Pages]
})
export class PagesModule {
}
