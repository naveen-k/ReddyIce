import { BranchResolver, TicketTypesResolver } from './manual-ticket.resolver';
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
        resolve: {
          branches: BranchResolver,
        },
      },
      {
        path: 'ticket',
        component: CreateTicketComponent,
        resolve: {
          branches: BranchResolver,
          ticketTypes: TicketTypesResolver,
        },
      },
      {
        path: 'ticket/:ticketId',
        component: CreateTicketComponent,
        resolve: {
          branches: BranchResolver,
          ticketTypes: TicketTypesResolver,
        },
      },
      {
        path: 'view/:ticketId',
        component: CreateTicketComponent,
        data: {
          viewMode: true,
        },
        resolve: {
          branches: BranchResolver,
          ticketTypes: TicketTypesResolver,
        },
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
