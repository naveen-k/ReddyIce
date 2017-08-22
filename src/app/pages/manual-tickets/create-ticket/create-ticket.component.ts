import { ManualTicketService } from '../manual-ticket.service';

import { Component } from '@angular/core';

@Component({
  selector: 'create-new-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
})
export class CreateTicketComponent {
  smartTableData: any;
  ticketObj: any = {};
  showDamagedCol: boolean = false;
  showHideTableCols: boolean = true;
  showHideDSDCols: boolean = false;
  toggleTextbox: boolean = false;
  constructor(protected service: ManualTicketService) {
    this.smartTableData = service.machineSmartTableData;
  }

  showHideDamagedColumn = function(arg) {
    if (arg === 3) {
      this.showDamagedCol = false;
      this.showHideDSDCols = false;
    } else if (arg === 2) {
      this.showDamagedCol = true;
      this.showHideDSDCols = false;
    } else if (arg === 1) {
      this.showDamagedCol = false;
      this.showHideDSDCols = true;
    }
  };

  showHideCols = function(arg) {
    if (arg === 1) {
      this.showHideTableCols = false;
    } else if (arg === 2) {
      this.showHideTableCols = true;
    }
  };

  editManualTicketsPBS() {
    this.toggleTextbox = !this.toggleTextbox;
  }

  isChecked: boolean = false;
}
