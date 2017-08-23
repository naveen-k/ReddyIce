import { SharedModule } from '../../shared/shared.module';
import { LoginService } from './login.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Login } from './login.component';
import { routing } from './login.routing';
import { ForgetPasswordService } from '../forget-password/forget-apssword.service';


@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    SharedModule,
  ],
  declarations: [
    Login,
  ],
  providers: [LoginService, ForgetPasswordService],
})
export class LoginModule { }
