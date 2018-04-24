import { Routes, RouterModule }  from '@angular/router';

import { Registration } from './registration.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Registration
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
