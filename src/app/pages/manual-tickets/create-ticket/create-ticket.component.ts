import { UserService } from '../../../shared/user.service';
import { UploadImageService } from '../../../shared/uploadImage.service';
import { Branch } from '../../../shared/interfaces/interfaces';
import { ManualTicketService } from '../manual-ticket.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'create-new-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
  providers: [UploadImageService],
})
export class CreateTicketComponent implements OnInit {
  smartTableData: any;
  dsdTableData: any;
  pbmTableData: any;
  pbsTableData: any;
  ticketObj: any = {};
  showDamagedCol: boolean = false;
  showHideTableCols: boolean = true;
  showHideDSDCols: boolean = false;
  toggleTextbox: boolean = false;
  allBranches: Branch;

  isDSDSelected: boolean = false;
  isPBMSelected: boolean = false;
  isPBSSelected: boolean = true;
  ticketTypes: any;
  products: any;
  branchBasedCustomers: any;
  customerBasedProducts: any;
  searchBranch: any;
  searchCustomer: any;
  tempObj: any;
  tempDisableCreateTicketFields: boolean = false;
  uploadPodButton: boolean = true;
  ticketNumberExists: boolean = true;
  constructor(
    protected userService: UserService,
    protected service: ManualTicketService, 
    protected uploadImgService: UploadImageService) {

    // this.service.getProducts().subscribe ((response) => {
    //   this.products = response;
    // });
    this.dsdTableData = service.dsdSmartTableData;
    this.pbmTableData = service.pbmSmartTableData;
    this.pbsTableData = service.pbsSmartTableData;
    
  }

  ngOnInit() {
    // console.log('this.service.disableCreateTicketFields : ', this.service.disableCreateTicketFields);
    if (this.service.disableCreateTicketFields) {
      this.tempDisableCreateTicketFields = true;
    } else {
      this.tempDisableCreateTicketFields = false;
    }
    const user = this.userService.getUser();

    this.service.getBranches(user.UserId).subscribe((response) => {
      this.allBranches = response;
      this.searchBranch = response[0].BranchID;
      this.onBranchChange();
    });


    this.service.getTicketTypes().subscribe((response) => {
      this.ticketTypes = response;
    });
  }

  onBranchChange() {
    this.service.getBranchBasedCustomers(this.searchBranch).subscribe((response) => {
      this.searchCustomer = response[0].CustomerId;
      this.branchBasedCustomers = response;
      this.onCustomerChange();
    });
  }

  onCustomerChange() {
    this.service.getCustomerBasedProducts(this.searchCustomer).subscribe((response) => {
      this.customerBasedProducts = response;
    });
  }

  ifPodReceived(arg) {
    if (arg === 1) {
      this.uploadPodButton = false;
    } else {
      this.uploadPodButton = true;
    }
  }

  onImageSelect(event) {
    console.log('onChange');
    const files = event.srcElement.files;
    console.log(files);
    this.uploadImgService.makeFileRequest('http://frozen.reddyice.com/myiceboxservice_dev/api/manualticket/uploadImage', [], files).subscribe(() => {
      console.log('sent');
    });
  }

  checkTicketNumber(ticketNumber) {
    console.log("checkTicketNumber : ", ticketNumber);
    this.service.checkTicketNumber(ticketNumber).subscribe((response) => {
        if (response.Message === 'Ticket Number available for use.') {
          this.ticketNumberExists = false;
        } else if (response.Message === 'Ticket Number already in use.') {
          this.ticketNumberExists = true;
        }
    });
  }

  addPbsProduct() {
    console.log("reached");
    this.tempObj = {
      product: 'Product1',
      unit: '$125',
      deliveredBag: '125',
      currentInv: '12',
    };
    this.pbsTableData.push(this.tempObj);
  }

  showHideDamagedColumn = function (arg) {
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

  showHideCols = function (arg) {
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
