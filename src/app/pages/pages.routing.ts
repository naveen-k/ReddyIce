import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule',
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule',
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'customer-management', loadChildren: './customer-management/customer-management.module#CustomerManagementModule' },
      { path: 'user-management', loadChildren: './user-management/user-management.module#UserManagementModule' },
      { path: 'reconciliation', loadChildren: './reconciliation/reconciliation.module#ReconciliationModule' },
      { path: 'day-end', loadChildren: './day-end/day-end.module#DayEndModule' },
      { path: 'manual-ticket', loadChildren: './manual-tickets/manual-ticket.module#ManualTicketModule' },
      { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' },
      { path: 'tracker', loadChildren: './tracker/tracker.module#TrackerModule' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'editors', loadChildren: './editors/editors.module#EditorsModule' },
      { path: 'components', loadChildren: './components/components.module#ComponentsModule' },
      { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
      { path: 'ui', loadChildren: './ui/ui.module#UiModule' },
      { path: 'forms', loadChildren: './forms/forms.module#FormsModule' },
      { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
      { path: 'maps', loadChildren: './maps/maps.module#MapsModule' },
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
