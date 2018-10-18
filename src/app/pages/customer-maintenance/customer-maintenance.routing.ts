import { Routes, RouterModule } from '@angular/router';
import { CustomerMaintenanceComponent } from './components/customer-maintenance/customer-maintenance.component';
import { CreateRequestComponent } from 'app/pages/customer-maintenance/components/create-request/create-request.component';
import { CustomerMaintenancePageComponent } from './customer-maintenance-component';

const routes: Routes = [
  {
    path: '',
    component: CustomerMaintenancePageComponent,
    children: [
      {
        path: 'view-request',
        component: CustomerMaintenanceComponent,
      },
      {
        path: 'create-request',
        component: CreateRequestComponent,
      }
    ],
  },
];

export const routing = RouterModule.forChild(routes);
