import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications/dist';
import { ManualTicket, TicketDetail } from '../manaul-ticket.interfaces';
import { UserService } from '../../../shared/user.service';
import { Branch, Customer } from '../../../shared/interfaces/interfaces';
import { ManualTicketService } from '../manual-ticket.service';

import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
})
export class CreateTicketComponent implements OnInit {

  ticket: ManualTicket = {} as ManualTicket;

  ticketTypes: any;

  ticketSubTypes: any[];

  branches: any[];

  // List of Cutomers
  customers: Customer[];

  // Selected Customer
  customer: Customer;

  modes: any[] = [];

  isTicketNumberExist: boolean = false;
  containsCharacters: boolean = false;
  ticketMinMaxLength: boolean = false;

  poContainsCharacters: boolean = false;
  poMinMaxLength: boolean = false;

  checkMinMaxLength: boolean = false;

  disablePodButton: boolean = true;
  formIsDirty: boolean = true;

  constructor(
    protected service: ManualTicketService,
    protected user: UserService,
    protected notification: NotificationsService,
    protected modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.loadTicketType();
    this.loadBranches();
  }

  loadTicketType() {
    this.service.getTicketTypes().subscribe((response) => {
      this.ticketTypes = response;

      // Set first Ticket type selected
      this.ticket.TicketTypeID = this.ticketTypes['CustomerType'][0]['id'];

      this.ticketChangeHandler();
    });
  }

  loadBranches() {
    this.service.getBranches(this.user.getUser().UserId).subscribe((res) => {
      // Discard 'All branches' and assign to branches object, if its coming in response;
      this.branches = res.filter((b) => b.BranchID !== 1);
    });
  }


  ticketChangeHandler() {
    const selectedTicket = this.ticketTypes.CustomerType.filter((t) => t.id === this.ticket.TicketTypeID)[0];

    // Reset type 
    this.ticketSubTypes = selectedTicket['Category'];

    this.modes = selectedTicket.Mode;
    if (this.modes && this.modes.length) {
      this.ticket.Mode = this.modes[0].id;
    }
  }

  branchChangeHandler() {

    this.loadCustomerOfBranch(this.ticket.BranchID);
  }

  loadCustomerOfBranch(branchId) {
    this.service.getBranchBasedCustomers(branchId).subscribe((res) => {
      this.customers = res;
    });
  }

  customerChangeHandler() {
    const customer = this.customers.filter((c) => c.CustomerId === this.ticket.CustomerID);
    this.loadCustomerDetail();

    // Reset ticket details
    this.ticket.TicketDetail = [{} as TicketDetail];
  }

  addProductRow() {
    if (!this.ticket.TicketDetail) { return; }
    this.ticket.TicketDetail.push({} as TicketDetail);
  }

  loadCustomerDetail() {
    this.service.getCustomerDetail(this.ticket.CustomerID).subscribe((res) => {
      this.customer = res;
    });
  }

  ticketNumberChangeHandler() {
    if (!this.ticket.TicketNumber) { return; }
    const ticketNumberLength = this.ticket.TicketNumber.length;
    if (isNaN(Number(this.ticket.TicketNumber))) {
      this.containsCharacters = true;
      this.ticketMinMaxLength = false;
    } else if (ticketNumberLength < 4 || ticketNumberLength > 10) {
      this.ticketMinMaxLength = true;
      this.containsCharacters = false;
    } else {
      this.service.checkTicketNumber(this.ticket.TicketNumber).subscribe((res) => {
        this.ticketMinMaxLength = false;
        this.containsCharacters = false;
        if (res.Message === 'Ticket Number already in use.') {
          this.isTicketNumberExist = true;
        } else if (res.Message === 'Ticket Number available for use.') {
          this.isTicketNumberExist = false;
          this.notification.success('Success', 'Ticket Number available for use.');
        }
      });
    }
  }

  poNumberChangeHandler() {
    if (!this.ticket.PONumber) { return; }
    const poNumberLength = this.ticket.PONumber.length;
    const letterNumber = /^[0-9a-zA-Z]+$/;
    if (poNumberLength < 4 || poNumberLength > 20) {
      this.poMinMaxLength = true;
      this.poContainsCharacters = false;
    } else if ((this.ticket.PONumber.match(letterNumber)) && (poNumberLength > 4 || poNumberLength < 20)) {
      this.poContainsCharacters = false;
      this.poMinMaxLength = false;
    } else {
      this.poMinMaxLength = false;
      if (!(this.ticket.PONumber.match(letterNumber))) {  
        this.poContainsCharacters = true;
      }
    }
  }

  checkNumberChangeHandler() {
    if (!this.ticket.CheckNumber) { return; }
    const checkNumberLength = this.ticket.CheckNumber.length;
    if (checkNumberLength > 20) {
      this.checkMinMaxLength = true;
    } else {
      this.checkMinMaxLength = false;
    }
  }

  productChangeHandler(ticketDetail) {
    // console.log(this.ticket.TicketDetail);
    const product = this.ticket.TicketDetail.filter(t => t.ProductID === ticketDetail.ProductID);
    if (product.length === 2) {
      ticketDetail.ProductID = '';
      alert('Product already selected');
      return;
    }
    ticketDetail['productSelected'] = this.customer.productdetail.filter(pr => pr.ProductID === ticketDetail.ProductID)[0];
  }

  unitChangeHandler(tdetail) {
    tdetail.totalAmount = tdetail.Quantity * tdetail.productSelected.Price;
    this.calculateTotalAmountAndUnit();
  }

  calculateTotalAmountAndUnit() {
    this.ticket['tempTotalUnit'] = 0;
    this.ticket.TotalSale = 0;

    this.ticket.TicketDetail.forEach((t) => {
      this.ticket['tempTotalUnit'] += Number(t.Quantity);
      this.ticket.TotalSale += Number(t['totalAmount']);
    });

    this.ticket.TotalAmount = this.ticket.TotalSale + (this.ticket.TotalSale * this.customer.Tax) / 100;
  }

  disableCashCheck() {
    if (this.ticket.SaleTypeID == 23) {
      this.ticket.CashAmount = '';
      this.ticket.CheckAmount = '';
      this.ticket.CheckNumber = '';
    }
  }

  isPodReceived(arg) {
    if (arg === 2) {
      this.disablePodButton = true;
    } else {
      this.disablePodButton = false;
    }
  }

  onCancelClick() {
    if (this.formIsDirty) {
      const activeModal = this.modalService.open(ModalComponent, {
        size: 'sm',
        backdrop: 'static',
      });
      activeModal.componentInstance.BUTTONS.OK = 'Discard';
      activeModal.componentInstance.showCancel = true;
      activeModal.componentInstance.modalHeader = 'Warning!';
      activeModal.componentInstance.modalContent = `You have unsaved changes, do you want to discard?`;
      activeModal.componentInstance.closeModalHandler = (() => {
        // location.reload();
        console.log("entered if");
      });

    }
  }

  formChangedHandler() {
    this.formIsDirty = true;
  }

  imageResponse: any;
  onFileUpload(event) {
    this.service.fileUpload().subscribe((response) => {
      this.imageResponse = response;
      console.log("imageResponse", this.imageResponse);
    });
  }

  deleteProductHandler(tdetail) {
    const index = this.ticket.TicketDetail.findIndex((t) => t.ProductID === tdetail.ProductID);
    this.ticket.TicketDetail.splice(index, 1);

    // update total amount and total count
    this.calculateTotalAmountAndUnit();
  }
}
