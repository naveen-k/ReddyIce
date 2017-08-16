import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component } from '@angular/core';

@Component({
    templateUrl: './day-end.component.html',
    styleUrls: ['./day-end.component.scss'],
})
export class DayEndComponent {
    isNewCustomer: boolean = true;
    userDataTable: any;
    unitReconciliation: any;
    ticketDetails: any;

  showNewCustomer(newCustomer) {
    this.isNewCustomer = newCustomer;
  }

    constructor(private service: DayEndService) {
        this.userDataTable = service.dataTableData;
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
