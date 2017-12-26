import { User } from '../../user-management/user-management.interface';
import { Location } from '@angular/common';
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
  isSubmited: boolean = false;
  pageTitle: string = 'New Manual Ticket';

  //ticket: ManualTicket = {} as ManualTicket;
  ticket: any = {} as ManualTicket;

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
  isDistributorExist: boolean;
  userSubTitle: string = '';

  ticketId: number; // Id of current ticket object
  tripId: number;   // tripId, redirected from day end page

  isReadOnly: boolean = false;  // flag for viewonly

  tripMode: boolean = false;    // flag for tripMode, redirected from

  isFormDirty: boolean = false;

  isTicketNumberExist: boolean = false;
  containsCharacters: boolean = false;
  ticketMinMaxLength: boolean = false;

  poContainsCharacters: boolean = false;
  poMinMaxLength: boolean = false;

  checkMinMaxLength: boolean = false;
  checkContainsCharacters: boolean = false;

  custType: boolean = false;
  hideSave: boolean = false;

  urlString = '../../list';

  // Current User Object
  user: User = <User>{};

  showList: boolean = false;
  pbsCount: number = 0;
  dsdCount: number = 0;
  inventoryCount: number = 0;
  mreadingCount: number = 0;
  readingCheck: boolean = false;
  isDownloadable: boolean = false;

  listFilter: any;

  file: any = {};

  acceptedPodFormat: Array<string> = ['jpg', 'jpeg', 'png', 'pdf'];

  // Customer input formatter
  inputFormatter = (res => `${res.CustomerNumber} - ${res.CustomerName}`);

  search = (text$: Observable<any>) => text$.debounceTime(200)
    .distinctUntilChanged()
    .map(term => {
      return this.customers.filter((v: any) => {
        if (!v.CustomerTypeID || !v.Active) { return false; }
        let flag = v.CustomerTypeID.toString() === this.ticket.CustomerType.toString();
        if (flag) {
          term = term.trim();
          flag = v.CustomerName.toLowerCase().indexOf(term.toLowerCase()) > -1
            || v.CustomerNumber.toString().toLowerCase().indexOf(term.toLowerCase()) > -1;
        }
        return flag;
      }).slice(0, 10);
    })

  date = { maxDate: {}, minDate: {} };

  constructor(
    protected service: ManualTicketService,
    protected userService: UserService,
    protected notification: NotificationsService,
    protected modalService: NgbModal,
    public activatedRoute: ActivatedRoute,
    protected route: Router,
    protected location: Location,
  ) { }

  ngOnInit() {
    const now = new Date();
    this.date.maxDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

    // Initialize user object with current logged In user;
    this.user = this.userService.getUser();
    this.userSubTitle = this.user.IsDistributor ? '-' + ' ' + this.user.Distributor.DistributorName : '';

    // Initialize properties from searched Object of List ticket page
    this.listFilter = this.service.getSearchedObject();
    this.ticket.DeliveryDate = this.listFilter.CreatedDate;
    this.ticket.BranchID = +this.listFilter.BranchId;
    this.ticket.isUserTypeDistributor = this.listFilter.userType ? this.listFilter.userType !== 'Internal' : null;
    this.ticket.UserID = this.listFilter.UserId ? +this.listFilter.UserId : 0;
    this.ticket.DistributorCopackerID = +this.listFilter.DistributorID;

    // get the ticket id from route
    this.ticketId = this.activatedRoute.snapshot.params['ticketId'];

    const activatedRouteObject = this.activatedRoute.snapshot.data;
    this.isReadOnly = activatedRouteObject['viewMode'];
    this.tripMode = activatedRouteObject['tripMode'];
    let branches = activatedRouteObject['branches'];

    let tripTicketEditMode = activatedRouteObject['tripTicketEditMode'];

    if (this.tripMode) {
      this.initializeTripMode();
    }

    if (tripTicketEditMode) {
      this.tripMode = tripTicketEditMode;

    } else {
      this.hideSave = false;
    }

    // Discard 'All branches' and assign to branches object, if its coming in response;
    branches = branches.filter((b) => b != null && b.BranchID !== 1);
    this.sortBranches(branches);

    this.branches = this.service.transformOptionsReddySelect(branches, 'BranchID', 'BranchCode', 'BranchName');

    this.ticketTypes = activatedRouteObject['ticketTypes'];

    if (this.user.Role.RoleID == 1) {
      this.loadDisributors();
    }
    if (this.user.IsDistributor || this.ticket.DistributorCopackerID) {
      // this.loadCustomers();
      this.loadDisributors();
      if (!this.ticket.DistributorCopackerID) {
        // Set distributor 
        this.ticket.DistributorCopackerID = this.user.Distributor.DistributorMasterId;
      }
    }

    this.prepareTicketTypes();

    // load customers, if BranchID is available
    if (this.ticket.BranchID || this.ticket.DistributorCopackerID) {
      this.loadCustomers();
    }

    // load driver or distributor
    if (this.ticket.BranchID && this.ticket.isUserTypeDistributor) {
      this.loadDisributors(this.ticket.BranchID);
    } else if (this.ticket.BranchID) {
      this.loadDriversOfBranch(this.ticket.BranchID);
    }

    // if ticketId is not null, consider it as edit ticket mode and load ticket object
    if (this.ticketId) {
      this.pageTitle = 'Edit Ticket Details';
      this.loadTicket(this.ticketId);
      this.hideSave = true;
    } else {
      this.hideSave = false;
    }

    if (this.isReadOnly) {
      this.pageTitle = 'View Ticket Details';
    }

    // File object Model
    this.file = {
      ImageTypeID: 40,
      ImageID: this.ticket.PODImageID,
    };
  }

  initializeTripMode() {
    this.tripId = this.activatedRoute.snapshot.params['tripId'];
    const queryParams = this.activatedRoute.snapshot.queryParams;

    const sdate = new Date(queryParams.sdate);
    const edate = (queryParams.edate !== "null") ? new Date(queryParams.edate) : new Date();

    this.date.minDate = { year: sdate.getFullYear(), month: sdate.getMonth() + 1, day: sdate.getDate() };
    this.date.maxDate = { year: edate.getFullYear(), month: edate.getMonth() + 1, day: edate.getDate() }

    this.ticket.DeliveryDate = this.date.minDate;

    this.ticket.BranchID = this.user.IsDistributor ? null : +queryParams.branchId; // Set branchId, for distributor branch id would be null
    this.ticket.isUserTypeDistributor = !!(+queryParams.isDistributor); // Set User type
    if (this.ticket.isUserTypeDistributor) {
      this.ticket.DistributorCopackerID = +queryParams.isDistributor;
    } else {
      this.ticket.UserID = +queryParams.driverId;
    }
  }

  sortBranches(branches) {
    // sort by name
    branches.sort(function (a, b) {
      var nameA = a.BranchName.toUpperCase(); // ignore upper and lowercase
      var nameB = b.BranchName.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
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
    this.ticket.PONumber = '';
    this.file.Image = null;
    this.isDownloadable = false;
    this.ticket.TicketProduct = [];

    this.resetSubTypesAndMode(selectedTicket);
    this.initializeSubTicketAndMode(selectedTicket);

    // Set IsSaleTicket for 'DSD', 'PBS'
    if (this.ticket.CustomerType === 20) {
      this.ticket.IsSaleTicket = true;
    } else if (this.ticket.CustomerType === 21) {
      this.ticket.IsSaleTicket = false;
    }

    this.resetCashAndCheck();

    if (this.ticket.DistributorCopackerID) {
      this.loadCustomers();
    }
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
    if (this.ticket.Customer.CustomerType !== 22) {
      this.ticket.Mode = null;
      return;
    }
    this.modes = selectedTicket.Mode;
    if (this.ticket.TicketTypeID === 27) {
      this.ticket.IsSaleTicket = true;
    }
  }

  branchChangeHandler() {
    this.ticket.Customer = '';
    this.ticket.DistributorCopackerID = null;
    this.ticket.TicketProduct = [];
    this.loadCustomers();
    if (this.ticket.isUserTypeDistributor) {
      this.loadDisributors(this.ticket.BranchID);
    } else {
      this.loadDriversOfBranch(this.ticket.BranchID);
    }


    this.listFilter.BranchId = this.ticket.BranchID;
  }

  loadCustomerOfBranch(branchId, callback) {
    this.service.getBranchBasedCustomers(branchId).subscribe((res) => {
      callback(res);
    });
  }

  loadCustomersByType(custType, callback) {
    this.service.getTypeBasedCustomers(custType, this.ticket.DistributorCopackerID).subscribe((res) => {
      callback(res);
    });
  }

  loadCustomers() {
    this.customers = [];
    const callback = (res) => {
      this.customers = res.Customer ? res.Customer : res;
      if (this.ticket.Customer && this.ticket.Customer.CustomerID) {
        const customer = res.filter(c => c.CustomerId === this.ticket.Customer.CustomerID)[0];
        this.ticket.CustomerType = customer.CustomerTypeID;
        this.ticket.Customer.ChainID = customer.ChainID;
        this.resetSubTypesAndMode(this.getSelectedTicketTypeObject());
      }
    };

    if (this.ticket.DistributorCopackerID && this.ticket.CustomerType) {
      this.loadCustomersByType(this.ticket.CustomerType, callback);
    } else if (!this.user.IsDistributor && !this.ticket.DistributorCopackerID) {
      this.loadCustomerOfBranch(this.ticket.BranchID, callback);
    }
  }

  loadDriversOfBranch(branchId) {

    this.service.getDriverByBranch(branchId, !this.ticket.isUserTypeDistributor).subscribe(res => {
      this.drivers = res;
      var that = this;
      if (this.drivers && this.drivers.length > 1) {
        var newArray = this.drivers.filter(function (el) {
          return el.UserId === that.ticket.UserID;
        });
        if (newArray.length === 0) {
          this.ticket.UserID = (this.drivers.length > 0) ? this.drivers[0].UserId : null;
        }
      }
    });
  }

  loadDisributors(branchId?: any) {
    this.service.getDistributerAndCopacker().subscribe(res => {
      this.distributors = this.service.transformOptionsReddySelect(res, 'DistributorCopackerID', 'Name');
    })
  }

  customerChangeHandler(event) {
    this.ticket.CustomerID = event.item.CustomerID || event.item.CustomerId;
    this.loadCustomerDetail(this.ticket.CustomerID, event.item.IsRICustomer);

    this.ticket.CustomerSourceID = (''+event.item.IsRICustomer == "true") ? 101 : 103
    // Reset ticket details
    this.ticket.TicketProduct = [{} as TicketProduct];
  }

  distributorChangeHandler() {
    this.loadCustomers();
    this.listFilter.DistributorID = this.ticket.DistributorCopackerID;
  }

  addProductRow() {
    if (!this.ticket.TicketProduct) { return; }
    this.ticket.TicketProduct.push({} as TicketProduct);
  }

  loadCustomerDetail(customerId, isRICustomer: boolean = true) {
    this.service.getCustomerDetail(customerId, isRICustomer).subscribe((res) => {
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
      this.custType = this.customer.PaymentType === 19 ? false : true;
    });
  }

  prepareTicketProduct(productdetail) {
    this.ticket.TicketProduct.forEach(td => {
      if (!td.ProductID) {
        td.ProductID = productdetail[0].ProductID;
        let index=this.ticket.TicketProduct.findIndex(x => x.ProductID == td.ProductID);
        this.productChangeHandler(td,index);
      }
      this.updateTicketDetailObject(td);
      if (this.ticket.CustomerType === 20 || (this.ticket.CustomerType === 22 && this.ticket.IsSaleTicket && this.ticket.TicketTypeID == 27)) {
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

  productChangeHandler(ticketDetail,index) {
    const product = this.ticket.TicketProduct.filter(t => t.ProductID === ticketDetail.ProductID);
    if (product.length === 2) {
      //ticketDetail.ProductID = '';
      const activeModal = this.modalService.open(ModalComponent, {
        size: 'sm',
        backdrop: 'static',
      });
      activeModal.componentInstance.BUTTONS.OK = 'OK';
      // activeModal.componentInstance.showCancel = true;
      activeModal.componentInstance.modalHeader = 'Warning!';
      activeModal.componentInstance.modalContent = `Product already selected! You cannot select same product again.`;
      activeModal.componentInstance.closeModalHandler = (() => {
        this.ticket.TicketProduct[index] = {};
      });
      return;
    }
    product[0]['ProductSourceID'] = this.customer.productdetail.filter(pr => pr.ProductID === product[0]['ProductID'])[0]['ProductSourceID']
    this.updateTicketDetailObject(ticketDetail);
    this.unitChangeHandler(ticketDetail);     // called this method to update the amount on product change itself
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
    const ticketNumberLength = this.ticket.TicketNumber.toString().length;
    this.ticketMinMaxLength = !(ticketNumberLength >= 4 && ticketNumberLength <= 10);
  }

  poNumberValidation() {
    const poNumberLength = this.ticket.PONumber.length;
    const letterNumber = /^[0-9a-zA-Z-]+$/;              // pattern to check for string to be alphanumeric
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
    const letterNumber = /^[0-9a-zA-Z]+$/;  // pattern to check for string to be alphanumeric
    if (checkNumberLength > 20 || checkNumberLength < 3) {
      this.checkMinMaxLength = true;
      this.checkContainsCharacters = false;
      this.custType = false;
    } else if ((this.ticket.CheckNumber.match(letterNumber)) &&
      (checkNumberLength > 3 || checkNumberLength < 20)) {      // check for string to be alphanumeric
      this.checkContainsCharacters = false;
      this.checkMinMaxLength = false;
      this.custType = false;
    } else {
      this.checkMinMaxLength = false;
      this.custType = false;
      if (!(this.ticket.CheckNumber.match(letterNumber))) {
        this.checkContainsCharacters = true;
      }
    }
  }

  checkAmountChangeHandler() {
    if (this.ticket.CheckAmount) {
      this.custType = false;
    }
  }

  cashAmountChangeHandler() {
    if (this.ticket.CashAmount) {
      this.custType = false;
    }
  }

  typeChangeHandler() {
    this.resetCashAndCheck();
  }

  modeChangeHandler() {
    this.resetCashAndCheck();
  }

  resetCashAndCheck() {
    this.ticket.CashAmount = null;
    this.ticket.CheckAmount = null;
    this.ticket.CheckNumber = null;
    if (this.ticket.CustomerType == 22 && this.ticket.IsSaleTicket == false) {
      this.ticket.TicketTypeID = 26;
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
    this.location.back();
  }

  onFileUpload(event) {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (e) => {
      let f = fileReader.result.split(','),
        accepted = this.acceptedPodFormat.filter(format => f[0].indexOf(format) > 0).length;
      let fileSize = event.target.files[0].size <= (2 * 1024 * 1024);
      if (accepted && fileSize) {
        this.file['Image'] = f[1];
        this.file['ImageMetaData'] = f[0];
        this.isFormDirty = true;
        this.isDownloadable = true;
      } else {
        const activeModal = this.modalService.open(ModalComponent, {
          size: 'sm',
          backdrop: 'static',
        });
        if (!fileSize) {
          var msg = 'File size cannot be greater than 2MB';
        }
        activeModal.componentInstance.BUTTONS.OK = 'OK';
        activeModal.componentInstance.modalHeader = 'Warning!';
        activeModal.componentInstance.modalContent = `${msg}`;
      }
    });

    if (fileReader) {
      fileReader.readAsDataURL(event.target.files[0]);
    }

  }

  uploadFile(file) {

    if (file.ImageID) {
      this.service.updateFile(file).subscribe((response) => {
        this.notification.success('', 'File updated');
        this.isSubmited = false;
      });
      return;
    }
    this.service.uploadFile(file).subscribe((response) => {
      this.ticket.PODImageID = response.ImageID;
      this.isDownloadable = true;
      file.Image = null;
      this.saveTicket();
    });
  }
  downloadPODImage(imageID, obj) {

    var savePod = (file) => {
      let ext = file.ImageMetaData ? file.ImageMetaData.substring(file.ImageMetaData.indexOf('/') + 1, file.ImageMetaData.indexOf(';')) : 'png';
      this.saveAs(file.ImageData, `${this.ticket.TicketID || 'pod'}.${ext}`)
    }
    if (this.file.Image) {
      savePod({ 'ImageMetaData': this.file.ImageMetaData, 'ImageData': this.file.Image });
      return;
    }
    this.service.getImageByID(imageID).subscribe((res) => {
      if (res.ImageData) {
        savePod(res);
      }
    });
  }
  saveAs(data, fileName) {
    var byteCharacters = atob(data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: 'application/octet-stream' });
    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      var url = window.URL.createObjectURL(blob);
      var anchorElem = document.createElement("a");
      anchorElem.style.display = "none";
      anchorElem.href = url;
      anchorElem.download = fileName;
      document.body.appendChild(anchorElem);
      anchorElem.click();
      document.body.removeChild(anchorElem);
      setTimeout(function () {
        window.URL.revokeObjectURL(url);
      });
    }
  }

  deletePODImage(imageID, TicketID) {
    this.service.deleteImageByID(imageID, TicketID).subscribe(
      (res) => {
        if (res) {
          this.isDownloadable = false;
          this.notification.success('', "POD Image deleted successfully");
        }
      }, (error) => {
        if (error) {
          this.notification.error('', 'Something went wrong while deletion of POD Image');
        }
      },
    );
  }
  deleteProductHandler(tdetail) {
    const index = this.ticket.TicketProduct.findIndex((t) => t.ProductID === tdetail.ProductID);
    this.ticket.TicketProduct.splice(index, 1);

    // update total amount and total count
    this.calculateTotalSale();
  }

  deleteTicket() {
    this.service.deleteDraftTicket(this.ticket.TicketID).subscribe(
      (response) => {
        if (response) {
          this.notification.success('', 'Ticket deleted successfully');
          this.routeToTicketListing();
        }
      },
      (error) => {
        if (error) {
          this.notification.error('', 'Something went wrong');
        }
      },
    );
  }

  loadTicket(ticketId) {
    this.service.getTicketById(ticketId).subscribe(response => {
      this.ticket = response[0];

      this.ticket.DeliveryDate = this.convertToDate(this.ticket.DeliveryDate);
      this.ticket.CustomerID = this.ticket.Customer.CustomerID;
      this.ticket.PODImageID = this.ticket.PODImage.PODImageID;
      this.ticket.isUserTypeDistributor = !!this.ticket.DistributorCopackerID;

      this.ticket.CustomerType = this.ticket.Customer.CustomerType;
      if (this.ticket.CustomerType == 22 && this.ticket.IsSaleTicket == false) {
        this.ticket.TicketTypeID = 26;
      }
      // Initialize to check/uncheck POD Received
      this.tempModels.podReceived = !!this.ticket.PODImageID;
      if (this.ticket.PODImageID) {
        this.isDownloadable = true;
      }

      this.loadCustomers();

      // load driver or distributor
      if (this.ticket.isUserTypeDistributor) {
        this.loadDisributors(this.ticket.BranchID);
      } else {
        this.loadDriversOfBranch(this.ticket.BranchID);
      }

      this.loadCustomerDetail(this.ticket.CustomerID, this.ticket.CustomerSourceID == 101);
    });
  }

  preSaveTicket() {
    this.isSubmited = true;
    if (!this.validateTicket(this.ticket)) {
      this.isSubmited = false;
      return;
    }
    const ticket = this.modifyTicketForSave(this.ticket);
    if (this.ticketId) {
      this.saveTicket();
    } else {
      this.service.checkTicketNumber(ticket).subscribe((res) => {
        this.saveTicket();
      }, err => {
        if (err.status === 412) {
          const activeModal = this.modalService.open(ModalComponent, {
            size: 'sm',
            backdrop: 'static',
          });
          activeModal.componentInstance.BUTTONS.OK = 'Merge';
          activeModal.componentInstance.showCancel = true;
          activeModal.componentInstance.modalHeader = 'Warning!';
          activeModal.componentInstance.modalContent = `Ticket already exist with this number. Do you want to merge?`;
          activeModal.componentInstance.closeModalHandler = (() => {
            this.saveTicket();
          });
          activeModal.componentInstance.dismissHandler = (() => {
            this.isSubmited = false;
            this.isFormDirty = true;
          });          
        } else if (err.status === 409) {
          this.notification.error('', 'Ticket Number already in use!!!');
          this.isSubmited = false;
          this.isFormDirty = true;
        }
      });
    }
  }



  saveTicket() {
    if (!this.validateTicket(this.ticket)) {
      this.isFormDirty = false;
      return;
    }
    this.isFormDirty = true;
    // Check if POD needs to upload
    if (this.file.Image) {
      this.uploadFile(this.file);
      return;
    }

    const ticket = this.modifyTicketForSave(this.ticket);

    if (this.ticketId) {
      // Update ticket

      this.service.updateTicket(ticket).subscribe(res => {

        this.notification.success('', res);
        this.location.back();
      }, err => {
        this.isFormDirty = true;
        this.isSubmited = false;
        this.notification.error('', err);
      });
      return;
    }
    
    // Save ticket 
    this.service.saveTicket(ticket).subscribe(res => {
      this.notification.success('', 'Ticket created successfully!');
      let d: any[] = ticket.DeliveryDate.split('-');
      if (this.tripMode && d.length && d.length == 3) {
        this.listFilter.CreatedDate.month = +d[0];
        this.listFilter.CreatedDate.day = +d[1];
        this.listFilter.CreatedDate.year = +d[2];
      } else {
        const now = new Date();
        this.listFilter.CreatedDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
      }
      if (this.tripMode) {
        this.location.back();
        return;
      }
      this.isSubmited = false;
      this.isFormDirty = false;
      this.route.navigate(['../'], { relativeTo: this.activatedRoute });
    }, (error) => {
      if (error) {
        if (error.status == 304) {
          this.notification.error('', 'Please add a product to create ticket');
        } if (error.status == 409) {
          this.notification.error('', 'No User exists for this Distributor. Please add a user to this distributor first.');
        } else {
          this.notification.error('', 'Error while creating ticket!');
        }
        this.isFormDirty = true;
      }
      this.isSubmited = false;
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
    if ((ticket.CustomerType == 22 || ticket.CustomerType == 21) && !ticket.IsSaleTicket) {
      ticket.TktType = 'C';
    }
    const clonedObject: ManualTicket = JSON.parse(JSON.stringify(ticket));

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

    if (this.tripMode) {
      clonedObject.TripID = this.tripId;
    }

    clonedObject.IsPaperTicket = true;
    clonedObject.CustomerSourceID = clonedObject.CustomerSourceID ? clonedObject.CustomerSourceID : 101;

    return clonedObject;
  }

  calculateCashCheckAndTotalAmount(ticket: ManualTicket) {
    if (!ticket.IsSaleTicket) {
      this.resetCashAndCheck();
    }
    ticket.TotalAmount = (Number.parseFloat((ticket.CheckAmount) ? ticket.CheckAmount.toString() : '0') || 0) + (Number.parseFloat((ticket.CashAmount) ? ticket.CashAmount.toString() : '0') + 0);
    console.info(ticket.CashAmount);
    console.info(ticket.CheckAmount);
    console.info(ticket.TotalAmount);
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
    this.ticket.UserID = this.ticket.DistributorCopackerID = this.ticket.BranchID = null;
    this.listFilter.BranchId = this.listFilter.DistributorID = this.listFilter.UserId = null;

    if (this.ticket.isUserTypeDistributor) {
      this.listFilter.userType = 'External';
      this.loadDisributors();
    } else {
      this.listFilter.userType = 'Internal';
      this.loadDriversOfBranch(this.ticket.BranchID);
    }
  }

  /**
   * 
   * Calculation 
   */
  updateTicketDetailObject(ticketDetail) {
    var prodDetail = {};
    prodDetail = this.customer.productdetail.filter(pr => pr.ProductID === ticketDetail.ProductID)[0];
    if (!prodDetail) {
      //ticketDetail.Price = ticketDetail.Rate;
      prodDetail = { Price: ticketDetail.Rate };
    }
    ticketDetail['productSelected'] = prodDetail;
    ticketDetail.Rate = ticketDetail['productSelected'].Price;
    ticketDetail.TaxPercentage = this.customer.Tax;
  }


  unitChangeHandler(tdetail) {
    tdetail.totalAmount = this.calculateProductTotalAmount(tdetail.Quantity, tdetail.productSelected.Price);
    this.calculateTotalSale();
  }

  bagsChangeHandler(tdetail) {
    // This canculation made  hardcoded 0 due to charge requirment on 8/12/2017 
    tdetail.totalAmount = this.calculateProductTotalAmount(tdetail.DeliveredBags, tdetail.productSelected.Price);
    this.calculateTotalSale();
  }

  calculateProductTotalAmount(q, p) {
    q = q || 0;
    p = p || 0;
    return q.fpArithmetic("*", p);
  }

  calculateTotalSale() {
    this.ticket['tempTotalUnit'] = 0;
    this.ticket.TotalSale = 0;

    this.ticket.TicketProduct.forEach((t) => {
      this.ticket['tempTotalUnit'] += +t.Quantity || 0;
      this.ticket.TotalSale += +t['totalAmount'] || 0;
    });
    this.tempModels.totalTax = this.ticket.TotalSale.fpArithmetic("*", this.customer.Tax) / 100;
    this.ticket.TaxAmount = this.tempModels.totalTax;
    if (this.ticket.CustomerType == 22 && !this.ticket.IsSaleTicket) {
      this.ticket.TotalSale = 0;
    }
    //this.ticket.TotalSale = this.ticket.TotalSale + (this.ticket.TotalSale * this.customer.Tax) / 100;
  }

  pbsQuantityCheck() {
    for (let i = 0; i < this.ticket.TicketProduct.length; i++) {
      if (!this.ticket.TicketProduct[i].Quantity) {
        this.pbsCount += 1;
      }
    }
    return this.pbsCount;
  }

  dsdQuantityCheck() {
    for (let i = 0; i < this.ticket.TicketProduct.length; i++) {
      if (!this.ticket.TicketProduct[i].Quantity) {
        this.dsdCount += 1;
      }
    }
    return this.dsdCount;
  }

  // TODO: CurrentInventory, DamagedBags not showing available for TicketProduct
  inventoryCheck() {
    for (let i = 0; i < this.ticket.TicketProduct.length; i++) {
      if (!this.ticket.TicketProduct[i].DeliveredBags || !this.ticket.TicketProduct[i]['CurrentInventory']
        || !this.ticket.TicketProduct[i]['DamagedBags']) {
        this.inventoryCount += 1;
      }
    }
    return this.inventoryCount;
  }

  mreadingCheck() {
    for (let i = 0; i < this.ticket.TicketProduct.length; i++) {
      if (this.ticket.TicketTypeID == 26) {
        if ((!this.ticket.TicketProduct[i].StartMeterReading || !this.ticket.TicketProduct[i]['EndMeterReading']) &&
          (this.ticket.TicketProduct[i].StartMeterReading !== 0 && this.ticket.TicketProduct[i]['EndMeterReading'] !== 0)) {
          this.mreadingCount += 1;
        } else if (this.ticket.TicketProduct[i].StartMeterReading > this.ticket.TicketProduct[i]['EndMeterReading']) {
          this.readingCheck = true;
        } else {
          this.readingCheck = false;
        }
      } else {
        this.readingCheck = false;
      }
    }
    return this.mreadingCount;
  }

  isPOReuquired() {
    if (this.ticket.CustomerType === 21) { return false; }
    const selectedCustomer = this.customers.filter(cust => this.ticket.CustomerID === cust.CustomerId)[0];
    return selectedCustomer ? !!selectedCustomer.PORequired : false;
  }

  isPODRequired() {
    // POD is not required if logged in user is OCS
    if (this.ticket.CustomerType === 21 || this.user.Role.RoleID === 4) { return false; }
    const selectedCustomer = this.customers.filter(cust => this.ticket.CustomerID === cust.CustomerId)[0];
    return selectedCustomer ? !!selectedCustomer.ChainID : false;
  }

  validateTicket(ticket): boolean {
    if (!ticket.TicketNumber) {
      this.notification.error('', 'Ticket Number is mandatory!!!');
      return false;
    } else if (!this.ticket.Customer) {
      this.notification.error('', 'Customer is mandatory!!!');
      return false;
    } else if (this.isPOReuquired() && !this.ticket.PONumber) {
      this.notification.error('', 'PO number is mandatory!!!');
      return false;
    } else if (this.isPODRequired() && !this.ticket.PODImageID && !this.file.Image && (this.ticket.CustomerType == 20 || this.ticket.CustomerType == 22)) {
      this.notification.error('', 'POD is mandatory!!!');
      return false;
    } else if (!this.ticket.UserID && !ticket.DistributorCopackerID) {
      this.notification.error('', 'Driver is mandatory!!!');
      return false;
    } else if (this.checkMinMaxLength) {
      this.notification.error('', 'Check Number should be 3 to 20 digits long!!!');
      return false;
    } else if (this.checkContainsCharacters) {
      this.notification.error('', 'Check number should be alphanumeric, cannot contain special characters!!!');
      return false;
    } else if (this.poContainsCharacters) {
      this.notification.error('', 'PO number should be alphanumeric, cannot contain special characters!!!');
      return false;
    } else if (this.poMinMaxLength) {
      this.notification.error('', 'PO number should be 4-20 digits long only!!!');
      return false;
    } else if (this.ticketMinMaxLength) {
      this.notification.error('', 'Ticket number should be 4-10 digits long only!!!');
      return false;
    } else if (this.ticket.CheckNumber && !this.ticket.CheckAmount) {
      this.notification.error('', 'Check Amount is required as Check Number exists!!!');
      return false;
    } else if (this.ticket.CheckAmount && !this.ticket.CheckNumber) {
      this.notification.error('', 'Check number is required as Check Amount exists!!!');
      return false;
    } else if (this.ticket.CustomerType === 21 && this.ticket.TicketProduct && this.pbsQuantityCheck() > 0) {
      this.pbsCount = 0;
      this.notification.error('', 'Delivered Bags for the products in the product list cannot be blank for PBS Customer type!!!');
      return false;
    } else if (this.ticket.CustomerType === 20 && this.ticket.TicketProduct && this.dsdQuantityCheck() > 0) {
      this.dsdCount = 0;
      this.notification.error('', 'Quantity for the products in the product list cannot be blank for DSD Customer type!!!');
      return false;
    } else if (this.ticket.CustomerType === 22 && this.ticket.TicketProduct && !this.ticket.IsSaleTicket && this.inventoryCheck() > 0) {
      this.inventoryCount = 0;
      this.notification.error('', 'All fields are mandatory for the products in the product list for PBM Inventory Customer type!!!');
      return false;
    } else if (this.ticket.CashAmount && this.ticket.CashAmount.toString().includes('-')) {
      this.notification.error('', 'Cash Amount cannot contain -');
      return false;
    } else if (this.ticket.CheckAmount && this.ticket.CheckAmount.toString().includes('-')) {
      this.notification.error('', 'Check Amount cannot contain -');
      return false;
    } else if (ticket.TicketProduct && ticket.TicketProduct.length < 1) {
      this.notification.error('', 'Product is mandatory for creating/ approving the ticket');
      return false;
    } else if (this.ticket.CustomerType === 20 && this.customer.PaymentType !== 19) {
      if (this.ticket.CashAmount || this.ticket.CashAmount === 0) {
        return true;
      } else {
        if (this.ticket.CheckAmount || this.ticket.CheckAmount === 0) {
          return true;
        } else {
          if (this.ticket.TicketTypeID === 26) {
            this.notification.error('', 'Either of Check Amount or Cash Amount is mandatory as Customer is of Cash type!!!');
            return false;
          } else {
            return true;
          }
        }
      }
    } else if (this.ticket.CustomerType === 22 && this.ticket.TicketProduct && this.ticket.IsSaleTicket) {
      if (this.mreadingCheck() > 0) {
        this.mreadingCount = 0;
        this.notification.error('', 'All fields are mandatory for the products in the product list for PBM Meter Reading Customer type!!!');
        return false;
      } else if (this.readingCheck) {
        this.notification.error('', 'Previous Reading cannot be greater than Current Reading!!!');
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

}
