
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

  constructor(
    protected service: ManualTicketService,
    protected user: UserService,
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
    this.service.checkTicketNumber(this.ticket.TicketNumber).subscribe((res) => {
      // console.log(res);
    });
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

  deleteProductHandler(tdetail) {
    const index = this.ticket.TicketDetail.findIndex((t) => t.ProductID === tdetail.ProductID);
    this.ticket.TicketDetail.splice(index, 1);
    
    // update total amount and total count
    this.calculateTotalAmountAndUnit();
  }
}
