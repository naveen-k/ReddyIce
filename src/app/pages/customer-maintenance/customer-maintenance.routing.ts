import { CreateRequestComponent } from './components/create-request/create-request.component';
import { Routes, RouterModule } from '@angular/router';
import { CustomerMaintenanceComponent } from './components/customer-maintenance/customer-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerMaintenanceComponent,
    children: [
     
      {
        path: 'create-request',
        component: CreateRequestComponent,
        
      },
     
      
    ],
  },
];

export const routing = RouterModule.forChild(routes);
