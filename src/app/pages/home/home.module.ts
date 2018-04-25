
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Home } from './home.component';
import { routing } from './home.routing';


@NgModule({
  imports: [
    routing,MaterialModule
  ],
  declarations: [
    Home,
  ],
  providers: [],
})
export class HomeModule { }
