import { Routes, RouterModule }  from '@angular/router';
import { Success } from './success/success.component';
import { QuickOrder } from './quickOrder.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: QuickOrder
   }, 
   {
    path: 'success',
    component: Success
   }  
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
