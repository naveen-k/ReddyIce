import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Home } from './home.component';
import { routing } from './home.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";


@NgModule({
  imports: [
    routing,MaterialModule,ReactiveFormsModule,CommonModule,FlexLayoutModule
  ],
  declarations: [
    Home
  ],
  providers: [],
})
export class HomeModule { }
