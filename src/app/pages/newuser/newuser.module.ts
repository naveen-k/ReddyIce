import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { NewUser } from './newuser.component';
import { routing } from './newuser.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    routing,MaterialModule,ReactiveFormsModule,CommonModule
  ],
  declarations: [
    NewUser
  ],
  providers: [],
})
export class NewUserModule { }
