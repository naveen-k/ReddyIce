
import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Feedback } from './feedback.component';
import { routing } from './feedback.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    routing,MaterialModule,ReactiveFormsModule,FormsModule,CommonModule
  ],
  declarations: [
    Feedback,
  ],
  providers: [],
})
export class FeedbackModule { }
