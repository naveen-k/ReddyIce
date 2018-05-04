
import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { ChangePassword } from './changePassword.component';
import { routing } from './changeaPassword.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    routing,MaterialModule,ReactiveFormsModule,FormsModule,CommonModule
  ],
  declarations: [
    ChangePassword
  ],
  providers: [],
})
export class ChangePasswordModule { }
