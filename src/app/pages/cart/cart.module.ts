import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
// import { Registration } from './registration.component';
import { Cart } from './cart.component';
import { routing } from './cart.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  imports: [
    routing,MaterialModule,ReactiveFormsModule,CommonModule,FlexLayoutModule
  ],
  declarations: [
    Cart
  ],
  providers: [],
})
export class CartModule { }
