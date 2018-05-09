import { Routes, RouterModule }  from '@angular/router';
import { History } from './history.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: History
   }  
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
