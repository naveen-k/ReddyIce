import { Routes, RouterModule }  from '@angular/router';

import { NewUser } from './newuser.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: NewUser
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
