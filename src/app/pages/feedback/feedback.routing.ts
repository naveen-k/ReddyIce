import { Routes, RouterModule }  from '@angular/router';

import { Feedback } from './feedback.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Feedback
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
