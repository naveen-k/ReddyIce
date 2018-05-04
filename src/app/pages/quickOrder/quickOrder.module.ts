import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Success } from '../quickOrder/success/success.component';
import { QuickOrder } from './quickOrder.component';
import { routing } from './quickOrder.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";


@NgModule({
  imports: [
    routing,MaterialModule,ReactiveFormsModule,CommonModule,FlexLayoutModule
  ],
  declarations: [
    QuickOrder,
    Success
  ],
  providers: [],
})
export class QuickOrderModule { }
