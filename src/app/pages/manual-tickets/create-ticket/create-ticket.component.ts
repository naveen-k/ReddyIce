import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { ManualTicket, TicketProduct } from '../manaul-ticket.interfaces';
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

  // hold temp models
  tempModels: any = {
    podReceived: false,
  };

  ticketTypes: any;

  ticketSubTypes: any[];

  branches: any[];

  // List of Cutomers
  customers: Customer[] = [];

  // List of Drivers
  drivers: any[];

  // List of distributors
  distributors: any[];

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

  // disablePodButton: boolean = true;

  urlString = '../../list';

  // Current User Object
  user: any = {};

  // Customer input formatter
  inputFormatter = (res => `${res.CustomerId || res.CustomerID} - ${res.CustomerName}`);

  search = (text$: Observable<any>) => text$.debounceTime(200)
    .distinctUntilChanged()
    .map(term => {
      return this.customers.filter((v: any) => {
        let flag = v.CustomerTypeID.toString() === this.ticket.CustomerType.toString();
        if (flag) {
          flag = v.CustomerName.toLowerCase().indexOf(term.toLowerCase()) > -1
            || v.CustomerId.toString().toLowerCase().indexOf(term.toLowerCase()) > -1;
        }
        return flag;
      }).slice(0, 10);
    })

  maxDate: {};

  constructor(
    protected service: ManualTicketService,
    protected userService: UserService,
    protected notification: NotificationsService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute,
    protected route: Router,
  ) { }

  ngOnInit() {
    const now = new Date();
    this.maxDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

    // Initialize user object with current logged In user;
    this.user = this.userService.getUser();

    // Initialize properties from searched Object of List ticket page
    const searchObject = this.service.getSearchedObject();
    this.ticket.DeliveryDate = searchObject.CreatedDate;
    this.ticket.BranchID = +searchObject.BranchId;
    this.ticket.isUserTypeDistributor = searchObject.userType ? searchObject.userType !== 'Internal' : null;
    this.ticket.UserID = +searchObject.UserId;
    this.ticket.DistributorCopackerID = +searchObject.DistributorID;

    // get the ticket id from route
    this.ticketId = this.activatedRoute.snapshot.params['ticketId'];
    const activatedRouteObject = this.activatedRoute.snapshot.data;
    this.isReadOnly = activatedRouteObject['viewMode'];

    this.branches = activatedRouteObject['branches'];

    // Discard 'All branches' and assign to branches object, if its coming in response;
    this.branches = this.branches.filter((b) => b.BranchID !== 1);
    this.ticketTypes = activatedRouteObject['ticketTypes'];
    this.prepareTicketTypes();

    // load customers, if BranchID is available
    if (this.ticket.BranchID) {
      this.loadCustomerOfBranch(this.ticket.BranchID);
    }

    // load driver or distributor
    if (this.ticket.BranchID && this.ticket.isUserTypeDistributor) {
      this.loadDisributors(this.ticket.BranchID);
    } else if (this.ticket.BranchID) {
      this.loadDriversOfBranch(this.ticket.BranchID);
    }

    // if ticketId is not null, consider it as edit ticket mode and load ticket object
    if (this.ticketId) {
      this.loadTicket(this.ticketId);
    }

  }

  prepareTicketTypes() {
    this.ticketTypes.CustomerType.forEach(element => {
      if (element.ID === 22) {
        element.Mode = [
          { 'Value': 'Meter Reading', 'ID': true },
          { 'Value': 'Inventory', 'ID': false },
        ];
      }
      element.category.forEach(el => {
        el.ID = +el.ID;
      });
    });
    if (!this.ticketId) {
      // Set first Ticket type selected
      this.ticket.CustomerType = this.ticketTypes['CustomerType'][0]['ID'];
      this.customerTypeChangeHandler();
    }
  }

  customerTypeChangeHandler() {
    const selectedTicket = this.getSelectedTicketTypeObject();

    // Reset Selected Customer
    this.ticket.Customer = '';

    this.resetSubTypesAndMode(selectedTicket);
    this.initializeSubTicketAndMode(selectedTicket);

    // Set IsSaleTicket for 'DSD', 'PBS'
    if (this.ticket.CustomerType === 20) {
      this.ticket.IsSaleTicket = true;
    } else if (this.ticket.CustomerType === 21) {
      this.ticket.IsSaleTicket = false;
    }

    this.resetCashAndCheck();
  }

  initializeSubTicketAndMode(selectedTicket) {
    // Set first type selected
    this.ticket.TicketTypeID = this.ticketSubTypes[0].ID;
    this.modes = selectedTicket.Mode;
    if (this.modes && this.modes.length) {
      this.ticket.IsSaleTicket = this.modes[0].ID;
    }
  }

  getSelectedTicketTypeObject(): any {
    return this.ticketTypes.CustomerType.filter((t) => t.ID === this.ticket.CustomerType)[0];
  }

  resetSubTypesAndMode(selectedTicket) {
    this.ticketSubTypes = selectedTicket['category'];
    if (this.ticket.TicketTypeID !== 22) {
      this.ticket.Mode = null;
      return;
    }
    this.modes = selectedTicket.Mode;
  }

  branchChangeHandler() {
    // this.confirmationModal('', () => {

    // });
    this.ticket.Customer = '';
    this.ticket.DistributorCopackerID = null;
    this.ticket.UserID = null;
    this.ticket.TicketProduct = [];
    this.loadCustomerOfBranch(this.ticket.BranchID);
    if (this.ticket.isUserTypeDistributor) {
      this.loadDisributors(this.ticket.BranchID);
    } else {
      this.loadDriversOfBranch(this.ticket.BranchID);
    }
  }

  loadCustomerOfBranch(branchId) {
    // this.isFormDirty = true;
    this.service.getBranchBasedCustomers(branchId).subscribe((res) => {
      this.customers = res;

      // 
      if (this.ticket.Customer && this.ticket.Customer.CustomerID) {
        const customer = res.filter(c => c.CustomerId === this.ticket.Customer.CustomerID)[0];
        this.ticket.CustomerType = customer.CustomerTypeID;
        this.resetSubTypesAndMode(this.getSelectedTicketTypeObject());
      }
    });
  }

  loadDriversOfBranch(branchId) {

    this.service.getDriverByBranch(branchId, !this.ticket.isUserTypeDistributor).subscribe(res => {
      this.drivers = res;
    });
  }

  loadDisributors(branchId) {
    this.service.getDistributorsByBranch(branchId).subscribe(res => {
      this.distributors = res;
    });
  }

  customerChangeHandler(event) {
    // const customer = this.customers.filter((c) => c.CustomerId === this.ticket.CustomerID);
    this.ticket.CustomerID = event.item.CustomerId;
    this.loadCustomerDetail(this.ticket.CustomerID);

    // Reset ticket details
    this.ticket.TicketProduct = [{} as TicketProduct];
  }

  addProductRow() {
    if (!this.ticket.TicketProduct) { return; }
    this.ticket.TicketProduct.push({} as TicketProduct);
  }

  loadCustomerDetail(customerId) {
    // this.isFormDirty = true;
    this.service.getCustomerDetail(customerId).subscribe((res) => {
      this.customer = res;

      // set first product selected
      if (res.productdetail.length) {
        const callPrepareTicket = () => {
          if (!this.ticket.CustomerType) {
            setTimeout(callPrepareTicket, 100);
            return;
          }
          this.prepareTicketProduct(res.productdetail);
        };
        setTimeout(callPrepareTicket, 100);
      }
    });
  }

  prepareTicketProduct(productdetail) {
    this.ticket.TicketProduct.forEach(td => {
      if (!td.ProductID) {
        td.ProductID = productdetail[0].ProductID;
      }
      this.updateTicketDetailObject(td);
      if (this.ticket.CustomerType === 20) {
        // Ticket Type is DSD
        td['totalAmount'] = this.calculateProductTotalAmount(td.Quantity, td['productSelected']['Price']);
      } else if (this.ticket.CustomerType === 21) {
        // Ticket Type is PBS
        td['totalAmount'] = this.calculateProductTotalAmount(td.Quantity, td['productSelected']['Price']);
      } else {
        // Ticket Type is PBM
        if (this.ticket.IsSaleTicket) {
          td['totalAmount'] = this.calculateProductTotalAmount(td.EndMeterReading - td.StartMeterReading, td['productSelected']['Price']);
        } else {
          td['totalAmount'] = this.calculateProductTotalAmount(td.DeliveredBags, td['productSelected']['Price']);
        }
      }

    });
    this.calculateTotalSale();
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
    const product = this.ticket.TicketProduct.filter(t => t.ProductID === ticketDetail.ProductID);
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

  confirmationModal(content: string, closeModalHandler) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      backdrop: 'static',
    });
    activeModal.componentInstance.BUTTONS.OK = 'OK';
    // activeModal.componentInstance.showCancel = true;
    activeModal.componentInstance.modalHeader = 'Warning!';
    activeModal.componentInstance.modalContent = content;
    activeModal.componentInstance.closeModalHandler = (() => {
      closeModalHandler();
    });
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

  typeChangeHandler() {
    this.resetCashAndCheck();
  }

  resetCashAndCheck() {
    this.ticket.CashAmount = null;
    this.ticket.CheckAmount = null;
    this.ticket.CheckNumber = null;
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
    const file = {
      ImageTypeID: 40,
      ImageID: this.ticket.PODImageID,
    };

    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      file['Image'] = fileReader.result.split(',')[1];
      this.uploadFile(file);
    });

    if (fileReader) {
      fileReader.readAsDataURL(event.target.files[0]);
    }

  }

  uploadFile(file) {
    if (file.ImageID) {
      this.service.updateFile(file).subscribe((response) => {
        this.notification.success('File updated');
      });
      return;
    }
    this.service.uploadFile(file).subscribe((response) => {
      this.ticket.PODImageID = response.ImageID;
      this.saveTicket();
    });
  }

  deleteProductHandler(tdetail) {
    const index = this.ticket.TicketProduct.findIndex((t) => t.ProductID === tdetail.ProductID);
    this.ticket.TicketProduct.splice(index, 1);

    // update total amount and total count
    this.calculateTotalSale();
  }

  loadTicket(ticketId) {
    this.service.getTicketById(ticketId).subscribe(response => {
      this.ticket = response[0];

      this.ticket.DeliveryDate = this.convertToDate(this.ticket.DeliveryDate);
      this.ticket.CustomerID = this.ticket.Customer.CustomerID;
      this.ticket.PODImageID = this.ticket.PODImage.PODImageID;
      this.ticket.isUserTypeDistributor = !!this.ticket.DistributorCopackerID;

      // Initialize to check/uncheck POD Received
      this.tempModels.podReceived = !!this.ticket.PODImageID;

      // load customers
      this.loadCustomerOfBranch(this.ticket.BranchID);

      // load driver or distributor
      if (this.ticket.isUserTypeDistributor) {
        this.loadDisributors(this.ticket.BranchID);
      } else {
        this.loadDriversOfBranch(this.ticket.BranchID);
      }

      this.loadCustomerDetail(this.ticket.CustomerID);
    });
  }

  saveTicket() {
    const ticket = this.modifyTicketForSave(this.ticket);
    if (this.ticketId) {
      // Update ticket
      this.service.updateTicket(ticket).subscribe(res => {
        this.notification.success(res);
        this.route.navigate(['../../'], { relativeTo: this.activatedRoute });
      });
      return;
    }
    // Save ticket
    this.service.saveTicket(ticket).subscribe(res => {
      this.notification.success('Ticket created successfully!');
      this.route.navigate(['../'], { relativeTo: this.activatedRoute });
    },
      (error) => {
        if (error) {
          this.notification.error('Error while creating ticket!');
        }
      });
  }

  submitTicket() {
    this.ticket.TicketStatusID = 24;
    this.saveTicket();
  }

  approveTicket() {
    this.ticket.TicketStatusID = 25;
    this.saveTicket();
  }

  editTicket() {
    this.ticket.TicketStatusID = 23;
    this.saveTicket();
  }

  modifyTicketForSave(ticket: ManualTicket): ManualTicket {
    const clonedObject = JSON.parse(JSON.stringify(ticket)); // { ...ticket }; 

    // removing all the unwanted properties.
    delete clonedObject['tempTotalUnit'];
    delete clonedObject['Created'];
    delete clonedObject['Modified'];

    if (clonedObject.isUserTypeDistributor) {
      delete clonedObject.UserID;
    } else {
      delete clonedObject.DistributorCopackerID;
    }

    if (!clonedObject || !clonedObject.TicketProduct) {
      return;
    }

    // Filter out all the blank Ticket Product Object 
    clonedObject.TicketProduct = clonedObject.TicketProduct.filter((t) => Object.keys(t).length);

    clonedObject.TicketProduct.forEach(t => {
      delete t['productSelected'];
      delete t['totalAmount'];
    });

    // Calculate Total Amount
    this.calculateCashCheckAndTotalAmount(clonedObject);

    // modify date obj to date string
    if (clonedObject.DeliveryDate) {
      clonedObject.DeliveryDate = `${clonedObject.DeliveryDate.month}-${clonedObject.DeliveryDate.day}-${clonedObject.DeliveryDate.year}`;
    }

    return clonedObject;
  }

  calculateCashCheckAndTotalAmount(ticket: ManualTicket) {
    if (!ticket.IsSaleTicket) {
      this.resetCashAndCheck();
      ticket.TicketTypeID = null;
    }
    ticket.TotalAmount = (ticket.CheckAmount || 0) + (ticket.CashAmount + 0);
  }

  convertToDate(date: string): any {
    date = date.split('T')[0];
    const dates = date.split('-');
    return { 'year': +dates[0], 'month': +dates[1], 'day': +dates[2] };
  }

  readingChangeHandler(tdetail) {
    tdetail.totalAmount = this.calculateProductTotalAmount(tdetail.EndMeterReading - tdetail.StartMeterReading, tdetail.productSelected.Price);
    this.calculateTotalSale();
  }

  userTypeChangeHandler() {
    if (this.ticket.isUserTypeDistributor) {
      this.loadDisributors(this.ticket.BranchID);
    } else {
      this.loadDriversOfBranch(this.ticket.BranchID);
    }
  }

  /**
   * 
   * Calculation 
   */
  updateTicketDetailObject(ticketDetail) {
    ticketDetail['productSelected'] = this.customer.productdetail.filter(pr => pr.ProductID === ticketDetail.ProductID)[0];
    ticketDetail.Rate = ticketDetail['productSelected'].Price;
    ticketDetail.TaxPercentage = this.customer.Tax;
  }


  unitChangeHandler(tdetail) {
    tdetail.totalAmount = this.calculateProductTotalAmount(tdetail.Quantity, tdetail.productSelected.Price);
    this.calculateTotalSale();
  }

  bagsChangeHandler(tdetail) {
    tdetail.totalAmount = this.calculateProductTotalAmount(tdetail.DeliveredBags, tdetail.productSelected.Price);
    this.calculateTotalSale();
  }

  calculateProductTotalAmount(q, p) {
    q = q || 0;
    p = p || 0;
    return +q * +p;
  }

  calculateTotalSale() {
    this.ticket['tempTotalUnit'] = 0;
    this.ticket.TotalSale = 0;

    this.ticket.TicketProduct.forEach((t) => {
      this.ticket['tempTotalUnit'] += +t.Quantity || 0;
      this.ticket.TotalSale += +t['totalAmount'] || 0;
    });
    this.tempModels.totalTax = (this.ticket.TotalSale * this.customer.Tax) / 100;
    this.ticket.TotalSale = this.ticket.TotalSale + (this.ticket.TotalSale * this.customer.Tax) / 100;
  }


}
