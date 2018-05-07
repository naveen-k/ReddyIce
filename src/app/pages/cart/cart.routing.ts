import { Routes, RouterModule }  from '@angular/router';
import { Cart } from './cart.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Cart
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
