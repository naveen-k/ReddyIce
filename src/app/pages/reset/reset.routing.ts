import { Routes, RouterModule }  from '@angular/router';

import { Reset } from './reset.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Reset
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
