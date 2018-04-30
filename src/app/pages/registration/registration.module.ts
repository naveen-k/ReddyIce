import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Registration } from './registration.component';
import { NewUserRegistration } from './newUser/newuser.component';
import { routing } from './registration.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    routing,MaterialModule,ReactiveFormsModule,CommonModule
  ],
  declarations: [
    Registration,
    NewUserRegistration
  ],
  providers: [],
})
export class RegistrationModule { }
