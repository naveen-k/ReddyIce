import { Routes, RouterModule }  from '@angular/router';

import { Registration } from './registration.component';
import { NewUserRegistration } from './newUser/newuser.component';
import { RegistrationConfirmation } from './confirmation/registrationConfirmation.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Registration
  },
  {
    path: 'newuser',
    component: NewUserRegistration
  },
  {
    path: 'confirmation',
    component: RegistrationConfirmation
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
