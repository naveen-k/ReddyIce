import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { NotificationsService } from 'angular2-notifications/dist';
import { NotificationsService } from 'angular2-notifications';
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

  // List of Drivers
  drivers: any[];

  // Selected Customer
  customer: Customer;

  modes: any[] = [];

  // Id of current ticket object
  ticketId: number;

  // flag for viewonly
  isReadOnly: boolean = false;

  isFormDirty: boolean = false;

  isTicketNumberExist: boolean = false;
  containsCharacters: boolean = false;
  ticketMinMaxLength: boolean = false;

  poContainsCharacters: boolean = false;
  poMinMaxLength: boolean = false;

  checkMinMaxLength: boolean = false;

  disablePodButton: boolean = true;

  showList: boolean = false;
  urlString = '../../list';
  customerName: any;

  constructor(
    protected service: ManualTicketService,
    protected user: UserService,
    protected notification: NotificationsService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute,
    protected route: Router,
  ) { }

  ngOnInit() {

    // get the ticket id from route
    this.ticketId = this.activatedRoute.snapshot.params['ticketId'];
    const activatedRouteObject = this.activatedRoute.snapshot.data;
    this.isReadOnly = activatedRouteObject['viewMode'];

    this.branches = activatedRouteObject['branches'];

    // Discard 'All branches' and assign to branches object, if its coming in response;
    this.branches = this.branches.filter((b) => b.BranchID !== 1);
    this.ticketTypes = activatedRouteObject['ticketTypes'];
    this.prepareTicketTypes();

    // if ticketId is not null, consider it as edit ticket mode and load ticket object
    if (this.ticketId) {
      this.loadTicket(this.ticketId);
    }

  }

  prepareTicketTypes() {
    this.ticketTypes.CustomerType.forEach(element => {
      if (element.ID === 22) {
        element.Mode = [
          { 'Value': 'Meter Reading', 'ID': 22 },
          { 'Value': 'Inventory', 'ID': 23 },
        ];
      }
      element.category.forEach(el => {
        el.ID = +el.ID;
      });
    });
    if (!this.ticketId) {
      // Set first Ticket type selected
      this.ticket.TicketTypeID = this.ticketTypes['CustomerType'][0]['ID'];
      this.ticketChangeHandler();
    }
  }

  ticketChangeHandler() {
    const selectedTicket = this.getSelectedTicketTypeObject();

    this.resetSubTypesAndMode(selectedTicket);
    this.initializeSubTicketAndMode(selectedTicket);

  }

  initializeSubTicketAndMode(selectedTicket) {
    // Set first type selected
    this.ticket.SaleTypeID = this.ticketSubTypes[0].ID;
    this.modes = selectedTicket.Mode;
    if (this.modes && this.modes.length) {
      this.ticket.Mode = this.modes[0].ID;
    }
  }

  getSelectedTicketTypeObject(): any {
    return this.ticketTypes.CustomerType.filter((t) => t.ID === this.ticket.TicketTypeID)[0];
  }

  resetSubTypesAndMode(selectedTicket) {
    this.ticketSubTypes = selectedTicket['category'];
    this.ticket.Mode = null;
  }

  branchChangeHandler() {
    this.loadCustomerOfBranch(this.ticket.BranchID);
    this.loadDriversOfBranch(this.ticket.BranchID);
  }

  loadCustomerOfBranch(branchId) {
    this.isFormDirty = true;
    this.service.getBranchBasedCustomers(branchId).subscribe((res) => {
      this.customers = res;
    });
  }

  loadDriversOfBranch(branchId) {
    this.service.getDriverByBranch(branchId).subscribe(res => {
      this.drivers = res;
    });
  }

  customerChangeHandler() {
    const customer = this.customers.filter((c) => c.CustomerId === this.ticket.CustomerID);
    this.loadCustomerDetail(this.ticket.CustomerID);

    // Reset ticket details
    this.ticket.TicketDetail = [{} as TicketDetail];
  }

  addProductRow() {
    if (!this.ticket.TicketDetail) { return; }
    this.ticket.TicketDetail.push({} as TicketDetail);
  }

  loadCustomerDetail(customerId) {
    this.isFormDirty = true;
    this.service.getCustomerDetail(customerId).subscribe((res) => {
      this.customer = res;

      // set first product selected
      if (res.productdetail.length) {
        this.ticket.TicketDetail.forEach(td => {
          if (!td.ProductID) {
            td.ProductID = res.productdetail[0].ProductID;
          }
          this.updateTicketDetailObject(td);

          if (this.ticket.SaleTypeID === 21) {
            // Ticket Type is DSD
            td['totalAmount'] = this.calculateProductTotalAmount(td.Quantity, td['productSelected']['Price']);
          } else if (this.ticket.SaleTypeID === 22) {
            // Ticket Type is PBS
            td['totalAmount'] = this.calculateProductTotalAmount(td.DeliveredBags, td['productSelected']['Price']);
          } else {
            // Ticket Type is PBM
            td['totalAmount'] = this.calculateProductTotalAmount(td.DeliveredBags, td['productSelected']['Price']);
          }
          this.calculateTotalAmountAndUnit();
        });

      }
    });
  }

  ticketNumberChangeHandler() {
    if (!this.ticket.TicketNumber || this.ticket.TicketID) { return; }
    this.ticketNumberValidation();
  }

  poNumberChangeHandler() {
    if (!this.ticket.PONumber) { return; }
    this.poNumberValidation();
  }

  checkNumberChangeHandler() {
    if (!this.ticket.CheckNumber) { return; }
    this.checkNumberValidation();
  }

  productChangeHandler(ticketDetail) {
    // console.log(this.ticket.TicketDetail);
    const product = this.ticket.TicketDetail.filter(t => t.ProductID === ticketDetail.ProductID);
    if (product.length === 2) {
      ticketDetail.ProductID = '';
      // alert('Product already selected');
      const activeModal = this.modalService.open(ModalComponent, {
        size: 'sm',
        backdrop: 'static',
      });
      activeModal.componentInstance.BUTTONS.OK = 'OK';
      // activeModal.componentInstance.showCancel = true;
      activeModal.componentInstance.modalHeader = 'Warning!';
      activeModal.componentInstance.modalContent = `Product already selected! You cannot select same product again.`;
      activeModal.componentInstance.closeModalHandler = (() => {
      });
      return;
    }

    this.updateTicketDetailObject(ticketDetail);
  }

  ticketNumberValidation() {
    const ticketNumberLength = this.ticket.TicketNumber.length;
    if (isNaN(Number(this.ticket.TicketNumber))) {              // check for no alphabets in the ticket number
      this.containsCharacters = true;
      this.ticketMinMaxLength = false;
    } else if (ticketNumberLength < 4 || ticketNumberLength > 10) {       // check for ticket number length 4-10 only
      this.ticketMinMaxLength = true;
      this.containsCharacters = false;
    } else {
      this.invokeTicketDuplicateService();
    }
  }

  invokeTicketDuplicateService() {
    this.service.checkTicketNumber(this.ticket.TicketNumber).subscribe((res) => {
      this.ticketMinMaxLength = false;
      this.containsCharacters = false;
      if (res.Message === 'Ticket Number already in use.') {
        this.isTicketNumberExist = true;
      } else if (res.Message === 'Ticket Number available for use.') {
        this.isTicketNumberExist = false;
        // this.notification.success('Success', 'Ticket Number available for use.');
      }
    });
  }

  poNumberValidation() {
    const poNumberLength = this.ticket.PONumber.length;
    const letterNumber = /^[0-9a-zA-Z]+$/;              // pattern to check for string to be alphanumeric
    if (poNumberLength < 4 || poNumberLength > 20) {    // check for ticket number length 4-20 only
      this.poMinMaxLength = true;
      this.poContainsCharacters = false;
    } else if ((this.ticket.PONumber.match(letterNumber)) &&
      (poNumberLength > 4 || poNumberLength < 20)) {      // check for string to be alphanumeric
      this.poContainsCharacters = false;
      this.poMinMaxLength = false;
    } else {
      this.poMinMaxLength = false;
      if (!(this.ticket.PONumber.match(letterNumber))) {
        this.poContainsCharacters = true;
      }
    }
  }

  checkNumberValidation() {
    const checkNumberLength = this.ticket.CheckNumber.length;
    if (checkNumberLength > 20) {
      this.checkMinMaxLength = true;
    } else {
      this.checkMinMaxLength = false;
    }
  }

  updateTicketDetailObject(ticketDetail) {
    ticketDetail['productSelected'] = this.customer.productdetail.filter(pr => pr.ProductID === ticketDetail.ProductID)[0];
    ticketDetail.Rate = ticketDetail['productSelected'].Price;
    ticketDetail.TaxPercentage = this.customer.Tax;
  }


  unitChangeHandler(tdetail) {
    tdetail.totalAmount = this.calculateProductTotalAmount(tdetail.Quantity, tdetail.productSelected.Price);
    this.calculateTotalAmountAndUnit();
  }

  bagsChangeHandler(tdetail) {
    tdetail.totalAmount = this.calculateProductTotalAmount(tdetail.DeliveredBags, tdetail.productSelected.Price);
    this.calculateTotalAmountAndUnit();
  }

  calculateProductTotalAmount(q, p) {
    q = q || 0;
    p = p || 0;
    return +q * +p;
  }

  calculateTotalAmountAndUnit() {
    this.ticket['tempTotalUnit'] = 0;
    this.ticket.TotalSale = 0;

    this.ticket.TicketDetail.forEach((t) => {
      this.ticket['tempTotalUnit'] += +t.Quantity || 0;
      this.ticket.TotalSale += +t['totalAmount'] || 0;
    });

    this.ticket.TotalAmount = this.ticket.TotalSale + (this.ticket.TotalSale * this.customer.Tax) / 100;
  }

  typeChangeHandler() {
    this.resetCashAndCheck();
  }

  resetCashAndCheck() {
    this.ticket.CashAmount = '';
    this.ticket.CheckAmount = '';
    this.ticket.CheckNumber = '';
  }


  isPodReceived(arg) {
    if (arg === 2) {
      this.disablePodButton = true;
    } else {
      this.disablePodButton = false;
    }
  }

  onCancelClick() {
    if (this.isFormDirty) {
      const activeModal = this.modalService.open(ModalComponent, {
        size: 'sm',
        backdrop: 'static',
      });
      activeModal.componentInstance.BUTTONS.OK = 'Discard';
      activeModal.componentInstance.showCancel = true;
      activeModal.componentInstance.modalHeader = 'Warning!';
      activeModal.componentInstance.modalContent = `You have unsaved changes, do you want to discard?`;
      activeModal.componentInstance.closeModalHandler = (() => {
        this.routeToTicketListing();
      });
    } else {
      this.routeToTicketListing();
    }
  }

  routeToTicketListing() {
    if (this.activatedRoute.snapshot.params.ticketId) {
      this.route.navigate([this.urlString], { relativeTo: this.activatedRoute });
    } else {
      this.route.navigate(['../list'], { relativeTo: this.activatedRoute });
    }
  }

  // imageResponse: any;
  onFileUpload(event) {
    this.service.uploadFile(event.target).subscribe((response) => {
      // this.imageResponse = response;
      // console.log("imageResponse", this.imageResponse);
    });
  }

  deleteProductHandler(tdetail) {
    const index = this.ticket.TicketDetail.findIndex((t) => t.ProductID === tdetail.ProductID);
    this.ticket.TicketDetail.splice(index, 1);

    // update total amount and total count
    this.calculateTotalAmountAndUnit();
  }

  loadTicket(ticketId) {
    this.service.getTicketById(ticketId).subscribe(response => {
      this.ticket = response[0];

      this.ticket.DeliveryDate = this.convertToDate(this.ticket.DeliveryDate);
      this.ticket.CustomerID = this.ticket.Customer.CustomerID;

      this.resetSubTypesAndMode(this.getSelectedTicketTypeObject());

      // load customers
      this.loadCustomerOfBranch(this.ticket.BranchID);
      this.loadDriversOfBranch(this.ticket.BranchID);
      this.loadCustomerDetail(this.ticket.CustomerID);
    });
  }

  saveTicket() {
    const ticket = this.modifyTicketForSave(this.ticket);
    if (this.ticketId) {
      // Update ticket
      this.service.updateTicket(ticket).subscribe(res => {
        //  this.notification.success(res);
      });
      return;
    }
    // Save ticket
    this.service.saveTicket(ticket).subscribe(res => {
      this.notification.success('Ticket created successfully!');
    },
    (error) => {
        if (error) {
          this.notification.error('Error while creating ticket!');
        }
    });
  }

  modifyTicketForSave(ticket: ManualTicket): ManualTicket {
    const clonedObject = JSON.parse(JSON.stringify(ticket)); // { ...ticket }; 

    // removing all the unwanted properties.
    delete clonedObject['tempTotalUnit'];
    delete clonedObject['Created'];
    delete clonedObject['Modified'];
    if (!clonedObject || !clonedObject.TicketDetail) {
      return;
    }
    clonedObject.TicketDetail.forEach(t => {
      delete t['productSelected'];
      delete t['totalAmount'];
    });

    // modify date obj to date string
    if (clonedObject.DeliveryDate) {
      clonedObject.DeliveryDate = `${clonedObject.DeliveryDate.month}-${clonedObject.DeliveryDate.day}-${clonedObject.DeliveryDate.year}`;
    }

    return clonedObject;
  }

  convertToDate(date: string): any {
    date = date.split('T')[0];
    const dates = date.split('-');
    return { 'year': +dates[0], 'month': +dates[1], 'day': +dates[2] };
  }

  readingChangeHandler(tdetail) {
    tdetail.totalAmount = this.calculateProductTotalAmount(tdetail.EndMeterReading - tdetail.StartMeterReading, tdetail.productSelected.Price);
    this.calculateTotalAmountAndUnit();
  }

  shortlistedCustomers = [];

  searchUserHandler(customerName) {
    this.shortlistedCustomers = [];

    // show or hide customer list based on type-ahead string
    this.showList = (customerName.length > 0) ? true : false;

    // populate list of customers based on type-ahead string
    for (const item of this.customers) {
      if (item.CustomerName.toLowerCase().includes(customerName)) {
        this.shortlistedCustomers.push(item);
      }
    }
    customerName = '';
  }

  customerSelected(selectedCustomer) {
    this.showList = false;
    this.ticket.CustomerID = selectedCustomer;
    this.customerChangeHandler();
  }

}
