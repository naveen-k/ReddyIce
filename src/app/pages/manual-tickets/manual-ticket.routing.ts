import { Routes, RouterModule } from '@angular/router';

import { ManualTicketComponent } from './manual-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: ManualTicketComponent,
  },
];

export const routing = RouterModule.forChild(routes);
