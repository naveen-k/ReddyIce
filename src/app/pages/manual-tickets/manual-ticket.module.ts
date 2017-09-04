import { BranchResolver, TicketTypesResolver } from './manual-ticket.resolver';
import { TicketStatusPipe } from './pipes/ticket-status.pipe';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { ViewTicketComponent } from './view-ticket-details/view-ticket.component';
import { ManualTicketService } from './manual-ticket.service';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgaModule } from '../../theme/nga.module';
// import { AppTranslationModule } from '../../app.translation.module';

import { ManualTicketComponent } from './manual-ticket.component';
import { routing } from './manual-ticket.routing';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    SharedModule,
    NgbModule,
    NgaModule,
  ],
  declarations: [
    ManualTicketComponent,
    TicketListComponent,
    TicketStatusPipe,
    CreateTicketComponent,
    ViewTicketComponent,
  ],
  providers: [
    ManualTicketService,
    BranchResolver,
    TicketTypesResolver,
  ],
})
export class ManualTicketModule { }
