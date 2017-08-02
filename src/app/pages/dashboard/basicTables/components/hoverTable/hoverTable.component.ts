import {Component, Output, EventEmitter} from '@angular/core';

import {BasicTablesService} from '../../basicTables.service';

@Component({
  selector: 'hover-table',
  templateUrl: './hoverTable.html',
  styleUrls: ['./hoverTable.scss'],
})
export class HoverTable {
  metricsTableData:Array<any>;

  @Output() onSelectCustomer = new EventEmitter();

  constructor(private _basicTablesService: BasicTablesService) {
    this.metricsTableData = _basicTablesService.customerTableData;
  }

  onEditClick(selected) {
    console.log('sss',selected);
    this.onSelectCustomer.emit(selected);
  }
}
