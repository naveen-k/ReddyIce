import { ForgetPasswordService } from './forget-apssword.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { ForgetPasswordComponent } from './forget-password.component';
import { routing } from './forget-password.routing';


@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
  ],
  declarations: [
    ForgetPasswordComponent,
  ],
  providers: [ForgetPasswordService],
})
export class ForgetPasswordModule { }
