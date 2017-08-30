import { CreateTicketComponent } from './create-ticket';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { Routes, RouterModule } from '@angular/router';

import { ManualTicketComponent } from './manual-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: ManualTicketComponent,
    children: [
      {
        path: 'list',
        component: TicketListComponent,
      },
      {
        path: 'ticket',
        component: CreateTicketComponent,
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];

export const routing = RouterModule.forChild(routes);
