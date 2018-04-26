import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Registration } from './registration.component';
import { routing } from './registration.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    routing,MaterialModule,ReactiveFormsModule,CommonModule
  ],
  declarations: [
    Registration
  ],
  providers: [],
})
export class RegistrationModule { }
