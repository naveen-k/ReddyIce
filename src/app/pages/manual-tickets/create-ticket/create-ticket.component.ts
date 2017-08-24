import { ManualTicketService } from '../manual-ticket.service';

import { Component } from '@angular/core';

@Component({
  selector: 'create-new-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
})
export class CreateTicketComponent {
  smartTableData: any;
  dsdTableData: any;
  pbmTableData: any;
  pbsTableData: any;
  ticketObj: any = {};
  showDamagedCol: boolean = false;
  showHideTableCols: boolean = true;
  showHideDSDCols: boolean = false;
  toggleTextbox: boolean = false;
  allBranches: any;

  isDSDSelected: boolean = false;
  isPBMSelected: boolean = false;
  isPBSSelected: boolean = true;
  ticketTypes: any;
  products: any;
  branchBasedCustomers: any;
  searchBranch: any;
  constructor(protected service: ManualTicketService) {
    this.service.getBranches().subscribe((response) => {
      this.allBranches = response;
      this.searchBranch = response[0].branchId;
    });
    this.service.getTicketTypes().subscribe ((response) => {
      this.ticketTypes = response;
    });
    this.service.getProducts().subscribe ((response) => {
      this.products = response;
    });
    this.dsdTableData = service.dsdSmartTableData;
    this.pbmTableData = service.pbmSmartTableData;
    this.pbsTableData = service.pbsSmartTableData;
  }

  onChange() {
    console.log("this.searchBranch", this.searchBranch);
    this.service.getBranchBasedCustomers(this.searchBranch).subscribe ((response) => {
      this.branchBasedCustomers = response;
    });
  }

  showHideDamagedColumn = function(arg) {
    if (arg === 3) {
      this.showDamagedCol = false;
      this.showHideDSDCols = false;
      this.isDSDSelected = false;
      this.isPBMSelected = false;
      this.isPBSSelected = true;
    } else if (arg === 2) {
      this.showDamagedCol = true;
      this.showHideDSDCols = false;
      this.isDSDSelected = false;
      this.isPBMSelected = true;
      this.isPBSSelected = false;
    } else if (arg === 1) {
      this.showDamagedCol = false;
      this.showHideDSDCols = true;
      this.isDSDSelected = true;
      this.isPBMSelected = false;
      this.isPBSSelected = false;
    }
  };

  showHideCols = function(arg) {
    if (arg === 1) {
      this.showHideTableCols = false;
    } else if (arg === 2) {
      this.showHideTableCols = true;
    }
  };

  editManualTickets() {
    this.toggleTextbox = !this.toggleTextbox;
  }

  isChecked: boolean = false;
}
