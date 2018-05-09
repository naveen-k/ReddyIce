import { Routes, RouterModule }  from '@angular/router';
import { Product } from './product.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Product
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
