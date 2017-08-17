import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component } from '@angular/core';

@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
    unitReconciliation: any;
    ticketDetails: any;

    constructor(private service: DayEndService) {
        this.unitReconciliation = service.dataTableData2;
        this.ticketDetails = service.dataTableData3;
    }

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.location.length;
    }

}
