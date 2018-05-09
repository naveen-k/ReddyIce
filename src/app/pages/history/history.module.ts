import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { History } from './history.component';
import { routing } from './history.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";


@NgModule({
  imports: [
    routing,MaterialModule,ReactiveFormsModule,CommonModule,FlexLayoutModule
  ],
  declarations: [
    History
  ],
  providers: [],
})
export class HistoryModule { }