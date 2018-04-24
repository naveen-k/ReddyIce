
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Registration } from './registration.component';
import { routing } from './registration.routing';


@NgModule({
  imports: [
    routing,MaterialModule
  ],
  declarations: [
    Registration,
  ],
  providers: [],
})
export class RegistrationModule { }
