import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'opentracker',
    loadChildren: 'app/pages/tracker/tracker.module#TrackerModule',
  },
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule',
  },
  {
    path: 'forgetpassword',
    loadChildren: 'app/pages/forget-password/forget-password.module#ForgetPasswordModule',
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule',
  },
  {
    path: 'resetpassword',
    loadChildren: 'app/pages/reset-password/reset-password.module#ResetPasswordModule',
  },
  {
    path: 'pages',
    component: Pages,
    children: [

      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'customer-management', loadChildren: './customer-management/customer-management.module#CustomerManagementModule' },
      { path: 'user-management', loadChildren: './user-management/user-management.module#UserManagementModule' },
      { path: 'day-end', loadChildren: './day-end/day-end.module#DayEndModule' },
      { path: 'manual-ticket', loadChildren: './manual-tickets/manual-ticket.module#ManualTicketModule' },
      { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' },
      { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule' },
      { path: 'tracker', loadChildren: './tracker/tracker.module#TrackerModule' },
      { path: 'load', loadChildren: './load/load.module#LoadModule' },
	/*	{ path: 'LookUp', loadChildren: './lookup/lookup.module#LookupModule' },*/
	   { path: 'customer-maintenance', loadChildren: './customer-maintenance/customer-maintenance.module#CustomerMaintenanceModule' } 
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
