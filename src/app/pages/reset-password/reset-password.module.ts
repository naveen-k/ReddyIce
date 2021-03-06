import { ResetPasswordService } from './reset-password.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { LoginService } from '../login/login.service';

import { ResetPasswordComponent } from './reset-password.component';
import { routing } from './reset-password.routing';
import { EqualValidator } from './equal-validator.directive';


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
    ResetPasswordComponent,
    EqualValidator,
  ],
  providers: [ResetPasswordService, LoginService],
})
export class ResetPasswordModule { }
