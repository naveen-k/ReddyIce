import { Routes, RouterModule } from '@angular/router';

import { ForgetPasswordComponent } from './forget-password.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ForgetPasswordComponent,
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
