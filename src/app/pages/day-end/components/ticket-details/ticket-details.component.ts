import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component } from '@angular/core';

@Component({
    templateUrl: './ticket-details.component.html',
    styleUrls: ['./ticket-details.component.scss'],
})
export class TicketDetailsComponent {
    unitReconciliation: any;
    ticketDetails: any;

    constructor(private service: DayEndService) {
        this.unitReconciliation = service.dataTableData2;
        this.ticketDetails = service.dataTableData3;
    }
}
