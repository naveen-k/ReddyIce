
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Login } from './login.component';
import { routing } from './login.routing';


@NgModule({
  imports: [
    routing,MaterialModule
  ],
  declarations: [
    Login,
  ],
  providers: [],
})
export class LoginModule { }
