import { DayEndComponent } from './components/day-end-list/day-end.component';
import { DayEndContainerComponent } from './components/day-end-container/day-end-container.component';
import { DetailsComponent } from './components/day-end-details/details.component';
import { TicketDetailsComponent } from './components/ticket-details/ticket-details.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DayEndService } from './day-end.service';
import { ManualTicketModule } from '../manual-tickets/manual-ticket.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: DayEndContainerComponent,
        children: [{
            path: 'list',
            component: DayEndComponent,
        },
        {
            path: 'detail/:tripId',
            component: DetailsComponent,
        },
        {
            path: 'ticket-detail',
            component: TicketDetailsComponent,
        },
        {
            path: '', redirectTo: 'list', pathMatch: 'full',
        }],
    },
];

@NgModule({
    declarations: [DayEndContainerComponent,
        DayEndComponent,
        DetailsComponent,
        TicketDetailsComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        CommonModule,
        NgaModule,
        NgbModule,
        SharedModule,
    ],
    providers: [DayEndService],
})
export class DayEndModule {

}
