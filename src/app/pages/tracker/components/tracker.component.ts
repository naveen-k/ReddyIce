import { UserService } from '../../../shared/user.service';
import { TrackerService } from '../tracker.service';
import * as GoogleMapsLoader from 'google-maps';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, HostListener, OnInit, ElementRef } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';

@Component({
  templateUrl: 'tracker.component.html',
  styleUrls: ['./tracker.component.scss'],
})
export class TrackerComponent implements OnInit {

  todaysDate: any;
  allBranches: any;
  allTrips: any = {};
  showSpinner: boolean = false;
  trips: any = [];
  selectedDate: any = '2017-09-26';
  tripFilterOption: any = {
    uId: '0',
    tripDate: this.selectedDate,
    branchId: 0,
    isForAll: false,
    TripCode: 1,
    DriverName: 'abc',
  };

  planned: boolean = true;
  actual: boolean = false;
  both: boolean = false;
  isDistributorExist: boolean;
  userSubTitle: string = '';

  selectedTrip: any;

  tripStartDate: any;

  marker: any = [];
  // selectedDate = this.service.formatDate(this.tripFilterOption.tripDate);
  userId = localStorage.getItem('userId');

  // variables for drawing route
  map: any;
  infowindow: any;
  bounds: any;
  pinColor: any;
  pinImage: any;

  isDistributor: any;

  constructor(
    private _elementRef: ElementRef,
    private service: TrackerService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId') || '';
    this.userService.getUserDetails(userId).subscribe((response) => {
      this.isDistributorExist = response.IsDistributor;
      this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + response.Distributor.DistributorName : '';
    });
    const now = new Date();
    this.tripFilterOption['tripDate'] = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

    // get the user type: isDistributor or internal
    this.isDistributor = this.userService.getUser().IsDistributor;    

    if (this.isDistributor === true) {
      this.actual = true;
      this.planned = false;
      this.tripFilterOption.branchId = 0;
      this.tripFilterOption.isForAll = false;
    } else {
      this.tripFilterOption.branchId = 1;
      this.tripFilterOption.isForAll = true;
    }

    this.loadBranches();
    this.loadTrips();
  }

  loadBranches() {
    this.service.getBranches(this.userId).subscribe((res) => {
      this.allBranches = res;

      // Remove 'All branch' object
      if (this.allBranches.length && this.allBranches[0].BranchID === 1) {
        this.allBranches.shift();
        this.sortBranches();
      }
    }, (error) => {
    });
  }

  sortBranches() {
    // sort by name
    this.allBranches.sort(function (a, b) {
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

  // Load all trips based on Date and Branch
  loadTrips() {
    this.service.getTrips(this.userId, this.selectedDate,
      this.tripFilterOption.branchId, this.tripFilterOption.isForAll).subscribe((res) => {
        if (typeof res == 'object') {
          this.trips = res.Trips;
          // this.trips = [{
          //   "TripID": 17067,
          //   "BranchID": 1364,
          //   "BranchCode": 316,
          //   "UserID": 2331,
          //   "TruckID": 101,
          //   "RouteNumber": 9991,
          //   "BeginMileage": 100.0,
          //   "EndMileage": 1111.0,
          //   "TripCode": 1,
          //   "TripStartDate": "2017-09-26T00:00:00",
          //   "TripEndDate": "2017-09-26T17:34:28.87",
          //   "PalletLoadQuantity": null,
          //   "PalletReturnQuantity": null,
          //   "IsProcessed": null,
          //   "IsUnplanned": true,
          //   "IsClosed": true,
          //   "Created": "2017-09-26T17:14:31.323",
          //   "CreatedBy": 2331,
          //   "Modified": "2017-09-26T17:34:28.87",
          //   "ModifiedBy": 2331,
          //   "DriverName": "Driver1 test",
          //   "BranchName": "316 ",
          //   "DistributorMasterID": 17,
          //   "isDistributor": 1,
          //   "TripTotalAmount": 22.00000,
          //   "TripTotalSale": 73.35000,
          //   "TripTicketList": [{
          //     "CustomerID": 16,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 22,
          //     "SaleTypeID": null,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "98745698",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "po090909",
          //     "CashAmount": 10.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": null,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": true,
          //     "IsNoPayment": null,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-27T08:42:49.823",
          //     "CreatedBy": 2330,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": null,
          //     "UserID": null,
          //     "CashRecvPrevDelv": null,
          //     "IsClosed": null,
          //     "IsPrinted": null,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": null,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": null,
          //     "IsReceivingPayment": null,
          //     "CurrentBalance": null,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": 10.00000,
          //     "TotalSale": 11.50000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "PRISNAT IBC",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": null,
          //     "ActualLongitude": null,
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 21,
          //       "ProductName": "10# COCKTAIL",
          //       "Quantity": 10.00,
          //       "Rate": 1.15,
          //       "IsTaxable": null,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }, {
          //     "CustomerID": 103891,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 1,
          //     "SaleTypeID": 1,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "6114251026",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "vjk",
          //     "CashAmount": 0.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": null,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": false,
          //     "IsNoPayment": false,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-26T17:27:48.783",
          //     "CreatedBy": 2331,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": 1364,
          //     "UserID": null,
          //     "CashRecvPrevDelv": null,
          //     "IsClosed": true,
          //     "IsPrinted": true,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": false,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": "R",
          //     "IsReceivingPayment": false,
          //     "CurrentBalance": 10.5000,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": null,
          //     "TotalSale": 10.50000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "WAL-MART #7347 PBS",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": "32.811211",
          //     "ActualLongitude": "-97.057602",
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 21,
          //       "ProductName": "10# COCKTAIL",
          //       "Quantity": 15.00,
          //       "Rate": 0.70,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }, {
          //     "CustomerID": 3452,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 1,
          //     "SaleTypeID": 1,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "6114251025",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "ygb",
          //     "CashAmount": 0.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": null,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": false,
          //     "IsNoPayment": false,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-26T17:23:59.997",
          //     "CreatedBy": 2331,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": 1364,
          //     "UserID": null,
          //     "CashRecvPrevDelv": null,
          //     "IsClosed": true,
          //     "IsPrinted": true,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": false,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": "R",
          //     "IsReceivingPayment": false,
          //     "CurrentBalance": 0.7000,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": null,
          //     "TotalSale": 0.70000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "WAL-MART #918 (ISB)",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": "32.8481",
          //     "ActualLongitude": "-96.8512",
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 24,
          //       "ProductName": "20# COCKTAIL",
          //       "Quantity": 1.00,
          //       "Rate": 0.70,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }, {
          //     "CustomerID": 164664,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 1,
          //     "SaleTypeID": 1,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "6114251024",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "dvhj",
          //     "CashAmount": 0.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": null,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": false,
          //     "IsNoPayment": false,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-26T17:23:59.993",
          //     "CreatedBy": 2331,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": 1364,
          //     "UserID": null,
          //     "CashRecvPrevDelv": null,
          //     "IsClosed": true,
          //     "IsPrinted": true,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": false,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": "R",
          //     "IsReceivingPayment": false,
          //     "CurrentBalance": 10.5000,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": null,
          //     "TotalSale": 10.50000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "TOM THUMB #3621 -PBM ISB",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": "32.7905",
          //     "ActualLongitude": "-96.8104",
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 24,
          //       "ProductName": "20# COCKTAIL",
          //       "Quantity": 15.00,
          //       "Rate": 0.70,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }, {
          //     "CustomerID": 89,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 1,
          //     "SaleTypeID": 1,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "6114251023",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "bxjdj",
          //     "CashAmount": 12.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": 0.0,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": false,
          //     "IsNoPayment": false,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-26T17:21:00.053",
          //     "CreatedBy": 2331,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": 1364,
          //     "UserID": null,
          //     "CashRecvPrevDelv": 0.0000,
          //     "IsClosed": true,
          //     "IsPrinted": true,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": false,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": "R",
          //     "IsReceivingPayment": false,
          //     "CurrentBalance": 4.9000,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": 12.00000,
          //     "TotalSale": 16.90000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "CONOCO LONE STAR BEVERAGE IBC",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": "32.7498",
          //     "ActualLongitude": "-96.8720",
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 24,
          //       "ProductName": "20# COCKTAIL",
          //       "Quantity": 10.00,
          //       "Rate": 0.70,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }, {
          //       "ProductID": 21,
          //       "ProductName": "10# COCKTAIL",
          //       "Quantity": 11.00,
          //       "Rate": 0.90,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }, {
          //     "CustomerID": 9,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 1,
          //     "SaleTypeID": 1,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "6114251022",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "bfjfj",
          //     "CashAmount": 0.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": null,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": false,
          //     "IsNoPayment": false,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-26T17:18:48.707",
          //     "CreatedBy": 2331,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": 1364,
          //     "UserID": null,
          //     "CashRecvPrevDelv": null,
          //     "IsClosed": true,
          //     "IsPrinted": true,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": false,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": "R",
          //     "IsReceivingPayment": true,
          //     "CurrentBalance": -101.7500,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": null,
          //     "TotalSale": 23.25000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "EMPIRE PETROLEUM SHELL",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": "32.736259",
          //     "ActualLongitude": "-96.864586",
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 24,
          //       "ProductName": "20# COCKTAIL",
          //       "Quantity": 15.00,
          //       "Rate": 0.90,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }, {
          //       "ProductID": 21,
          //       "ProductName": "10# COCKTAIL",
          //       "Quantity": 15.00,
          //       "Rate": 0.65,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }],
          //   "TripStatusID": 23
          // }, {
          //   "TripID": 17069,
          //   "BranchID": 1364,
          //   "BranchCode": 316,
          //   "UserID": 2331,
          //   "TruckID": 101,
          //   "RouteNumber": 9992,
          //   "BeginMileage": 1111.0,
          //   "EndMileage": null,
          //   "TripCode": 2,
          //   "TripStartDate": "2017-09-26T00:00:00",
          //   "TripEndDate": null,
          //   "PalletLoadQuantity": null,
          //   "PalletReturnQuantity": null,
          //   "IsProcessed": null,
          //   "IsUnplanned": false,
          //   "IsClosed": false,
          //   "Created": "2017-09-26T17:55:53.3",
          //   "CreatedBy": 2331,
          //   "Modified": "2017-09-26T17:55:53.3",
          //   "ModifiedBy": 2331,
          //   "DriverName": "Driver2 test",
          //   "BranchName": "316 ",
          //   "DistributorMasterID": 17,
          //   "isDistributor": 1,
          //   "TripTotalAmount": 0.0,
          //   "TripTotalSale": 0.0,
          //   "TripTicketList": [{
          //     "CustomerID": 16,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 22,
          //     "SaleTypeID": null,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "98745698",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "po090909",
          //     "CashAmount": 10.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": null,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": true,
          //     "IsNoPayment": null,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-27T08:42:49.823",
          //     "CreatedBy": 2330,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": null,
          //     "UserID": null,
          //     "CashRecvPrevDelv": null,
          //     "IsClosed": null,
          //     "IsPrinted": null,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": null,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": null,
          //     "IsReceivingPayment": null,
          //     "CurrentBalance": null,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": 10.00000,
          //     "TotalSale": 11.50000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "PRISNAT IBC",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": null,
          //     "ActualLongitude": null,
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 21,
          //       "ProductName": "10# COCKTAIL",
          //       "Quantity": 10.00,
          //       "Rate": 1.15,
          //       "IsTaxable": null,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }, {
          //     "CustomerID": 103891,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 1,
          //     "SaleTypeID": 1,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "6114251026",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "vjk",
          //     "CashAmount": 0.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": null,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": false,
          //     "IsNoPayment": false,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-26T17:27:48.783",
          //     "CreatedBy": 2331,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": 1364,
          //     "UserID": null,
          //     "CashRecvPrevDelv": null,
          //     "IsClosed": true,
          //     "IsPrinted": true,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": false,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": "R",
          //     "IsReceivingPayment": false,
          //     "CurrentBalance": 10.5000,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": null,
          //     "TotalSale": 10.50000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "WAL-MART #7347 PBS",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": "32.811211",
          //     "ActualLongitude": "-97.057602",
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 21,
          //       "ProductName": "10# COCKTAIL",
          //       "Quantity": 15.00,
          //       "Rate": 0.70,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }, {
          //     "CustomerID": 3452,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 1,
          //     "SaleTypeID": 1,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "6114251025",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "ygb",
          //     "CashAmount": 0.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": null,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": false,
          //     "IsNoPayment": false,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-26T17:23:59.997",
          //     "CreatedBy": 2331,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": 1364,
          //     "UserID": null,
          //     "CashRecvPrevDelv": null,
          //     "IsClosed": true,
          //     "IsPrinted": true,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": false,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": "R",
          //     "IsReceivingPayment": false,
          //     "CurrentBalance": 0.7000,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": null,
          //     "TotalSale": 0.70000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "WAL-MART #918 (ISB)",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": "32.8481",
          //     "ActualLongitude": "-96.8512",
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 24,
          //       "ProductName": "20# COCKTAIL",
          //       "Quantity": 1.00,
          //       "Rate": 0.70,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }, {
          //     "CustomerID": 164664,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 1,
          //     "SaleTypeID": 1,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "6114251024",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "dvhj",
          //     "CashAmount": 0.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": null,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": false,
          //     "IsNoPayment": false,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-26T17:23:59.993",
          //     "CreatedBy": 2331,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": 1364,
          //     "UserID": null,
          //     "CashRecvPrevDelv": null,
          //     "IsClosed": true,
          //     "IsPrinted": true,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": false,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": "R",
          //     "IsReceivingPayment": false,
          //     "CurrentBalance": 10.5000,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": null,
          //     "TotalSale": 10.50000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "TOM THUMB #3621 -PBM ISB",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": "32.7905",
          //     "ActualLongitude": "-96.8104",
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 24,
          //       "ProductName": "20# COCKTAIL",
          //       "Quantity": 15.00,
          //       "Rate": 0.70,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }, {
          //     "CustomerID": 89,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 1,
          //     "SaleTypeID": 1,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "6114251023",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "bxjdj",
          //     "CashAmount": 12.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": 0.0,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": false,
          //     "IsNoPayment": false,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-26T17:21:00.053",
          //     "CreatedBy": 2331,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": 1364,
          //     "UserID": null,
          //     "CashRecvPrevDelv": 0.0000,
          //     "IsClosed": true,
          //     "IsPrinted": true,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": false,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": "R",
          //     "IsReceivingPayment": false,
          //     "CurrentBalance": 4.9000,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": 12.00000,
          //     "TotalSale": 16.90000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "CONOCO LONE STAR BEVERAGE IBC",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": "32.7498",
          //     "ActualLongitude": "-96.8720",
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 24,
          //       "ProductName": "20# COCKTAIL",
          //       "Quantity": 10.00,
          //       "Rate": 0.70,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }, {
          //       "ProductID": 21,
          //       "ProductName": "10# COCKTAIL",
          //       "Quantity": 11.00,
          //       "Rate": 0.90,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }, {
          //     "CustomerID": 9,
          //     "CustomerType": 0,
          //     "HHCustomerID": null,
          //     "TripID": 17067,
          //     "DistributorCopackerID": null,
          //     "TicketTypeID": 1,
          //     "SaleTypeID": 1,
          //     "DNSImageID": null,
          //     "DNSReasonID": null,
          //     "PODImageID": null,
          //     "ReceiverSignatureImageID": null,
          //     "CreditCardTransactionID": null,
          //     "TicketNumber": "6114251022",
          //     "IsInvoice": null,
          //     "DeliveryDate": null,
          //     "PONumber": "bfjfj",
          //     "CashAmount": 0.0,
          //     "CheckAmount": 0.0,
          //     "CheckNumber": null,
          //     "CreditCardAmount": null,
          //     "ReceiverName": null,
          //     "IsDexed": null,
          //     "PrintedCopies": null,
          //     "Notes": null,
          //     "TaxAmount": null,
          //     "IsPaperTicket": false,
          //     "IsNoPayment": false,
          //     "CardPaymentStatus": null,
          //     "Created": "2017-09-26T17:18:48.707",
          //     "CreatedBy": 2331,
          //     "Modified": null,
          //     "ModifiedBy": null,
          //     "TicketStatusID": 23,
          //     "OrderID": null,
          //     "BranchID": 1364,
          //     "UserID": null,
          //     "CashRecvPrevDelv": null,
          //     "IsClosed": true,
          //     "IsPrinted": true,
          //     "ClosedReason": null,
          //     "RevisitNote": null,
          //     "RevisitDate": null,
          //     "IsRevisitClosed": null,
          //     "IsReqRevisit": false,
          //     "ReasonPictureID": null,
          //     "SignImageID": null,
          //     "TktType": "R",
          //     "IsReceivingPayment": true,
          //     "CurrentBalance": -101.7500,
          //     "CurrentBalanceDateTime": null,
          //     "CurrentBalanceDelDate": null,
          //     "RecordTypeId": null,
          //     "TotalAmount": null,
          //     "TotalSale": 23.25000,
          //     "IsSaleTicket": true,
          //     "CustomerName": "EMPIRE PETROLEUM SHELL",
          //     "PlannedLatitude": "",
          //     "PlannedLongitude": "",
          //     "ActualLatitude": "32.736259",
          //     "ActualLongitude": "-96.864586",
          //     "ActualSequence": null,
          //     "VisitTime": null,
          //     "TicketProduct": [{
          //       "ProductID": 24,
          //       "ProductName": "20# COCKTAIL",
          //       "Quantity": 15.00,
          //       "Rate": 0.90,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }, {
          //       "ProductID": 21,
          //       "ProductName": "10# COCKTAIL",
          //       "Quantity": 15.00,
          //       "Rate": 0.65,
          //       "IsTaxable": false,
          //       "TaxPercentage": 0.00,
          //       "StartMeterReading": null,
          //       "EndMeterReading": null,
          //       "AssetId": null,
          //       "DeliveredBags": null,
          //       "CurrentInventory": null
          //     }],
          //     "Drayage": null,
          //     "BuyBack": null,
          //     "PlannedSequence": null
          //   }],
          //   "TripStatusID": 23
          // }];
          console.log('this.trips', this.trips.length);

          if (this.trips[0]) {
            this.tripFilterOption.DriverName = this.trips[0].DriverName;
            this.driverChangeHandler();
            this.tripFilterOption.TripCode = this.trips[0].TripCode;
            this.fetchTicketDetailsByTrip(this.tripFilterOption.TripCode);
          }
          this.drawMapPath();
        } else {
          this.trips = [];
        }
      }, (error) => {
        console.log(error);
        this.trips = [];
      });
  }

  sliceTime(str) {
    return str.slice(11, 16);
  }

  // Filter TicketDetails based on the Trip selected
  fetchTicketDetailsByTrip(TripCode) {
    for (var i = 0; i < this.trips.length; i++) {
      if (parseInt(TripCode) === this.trips[i].TripCode) {
        this.selectedTrip = this.trips[i].TripTicketList;
        this.tripStartDate = this.trips[i].TripStartDate
      }
    }
    console.log('this.selectedTrip', this.selectedTrip);
    this.drawMapPath();
  }

  // Fetch selected Date
  dateChangeHandler() {
    this.selectedDate = this.service.formatDate(this.tripFilterOption.tripDate);
    this.loadTrips();
    this.drawMapPath();
  }

  // Fetch selected Branch
  branchChangeHandler() {
    console.log('tripFilterOption.branchId', this.tripFilterOption.branchId);
    this.loadTrips();
  }

  // Fetch selected Trip
  tripChangeHandler() {
    console.log('TripCode', this.tripFilterOption.TripCode);
    this.fetchTicketDetailsByTrip(this.tripFilterOption.TripCode);
  }

  driverSpecTrips: any = [];
  // Fetch selected Driver
  driverChangeHandler() {
    console.log('TripCode', this.tripFilterOption.DriverName);
    this.driverSpecTrips = [];
    for (var i = 0; i < this.trips.length; i++) {
      if (this.tripFilterOption.DriverName == this.trips[i].DriverName) {
        this.driverSpecTrips.push(this.trips[i].TripCode);
      }
    }
    console.log('this.driverSpecTrips', this.driverSpecTrips);
    this.fetchTicketDetailsByTrip(this.tripFilterOption.TripCode);
  }

  // Filter Markers in the Google Map based on Sequence Radio Button selection
  sequenceChangeHandler(sequence) {
    if (sequence === 1) {
      this.planned = true;
      this.actual = false;
      this.both = false;
    } else if (sequence === 2) {
      this.actual = true;
      this.planned = false;
      this.both = false;
    } else {
      this.both = true;
      this.planned = false;
      this.actual = false;
    }
    this.drawMapPath();
  }

  drawMapPath() {
    let el = this._elementRef.nativeElement.querySelector('.google-maps');
    // TODO: do not load this each time as we already have the library after first attempt
    GoogleMapsLoader.load((google) => {
      this.map = new google.maps.Map(el, {
        center: new google.maps.LatLng(32.736259, -96.864586),
        // zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });
      this.infowindow = new google.maps.InfoWindow();
      this.bounds = new google.maps.LatLngBounds();
      this.pinColor = "A52A2A";
      this.pinImage = new google.maps.MarkerImage(
        "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + this.pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

      //const selectedTrip = [{ PlannedLatitude: '32.736259', PlannedLongitude: '-96.864586' }, { PlannedLatitude: '32.7498', PlannedLongitude: '-96.8720' }, { PlannedLatitude: '32.7905', PlannedLongitude: '-96.8104' }, { PlannedLatitude: '32.8481', PlannedLongitude: '-96.8512' }]

      // If Planned Sequence Radio button is selected
      if (this.planned) {
        this.drawPolyline(google, 1);
      } else if (this.actual) {
        this.drawPolyline(google, 2);
      } else {
        this.drawPolyline(google, 1);
      }
    });
  }

  drawPolyline(google, sequence) {
    if (this.selectedTrip) {
      for (var i = 0; i < this.selectedTrip.length; i++) {

        // changing color of the marker icon based on condition
        if (this.selectedTrip[i].TktType === 29) {
          this.pinColor = 'ffff00';    // yellow color for Did Not Service stops
        } else if (this.selectedTrip[i].TicketNumber == null) {
          this.pinColor = 'ff0000';    // red color for Skipped stops
        } else {
          this.pinColor = 'b8d5f4';          // default color for markers
        }

        // customising the marker icon here
        if (this.selectedTrip[i].ActualSequence != null)
        this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (this.selectedTrip[i].ActualSequence).toString() + "|" + this.pinColor + "|000",
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34));

        // start point of straight line
        if (sequence === 1) {
          var startPt = new google.maps.LatLng(this.selectedTrip[i].PlannedLatitude, this.selectedTrip[i].PlannedLongitude);
        } else if (sequence === 2) {
          var startPt = new google.maps.LatLng(this.selectedTrip[i].ActualLatitude, this.selectedTrip[i].ActualLongitude);
        }


        // end point fo straight line
        if (sequence === 1) {
          // adding check here to avoid 'undefined' condition
          if (this.selectedTrip[i + 1]) {
            var endPt = new google.maps.LatLng(this.selectedTrip[i + 1].PlannedLatitude, this.selectedTrip[i + 1].PlannedLongitude);
          }
        } else if (sequence === 2) {
          // adding check here to avoid 'undefined' condition
          if (this.selectedTrip[i + 1]) {
            var endPt = new google.maps.LatLng(this.selectedTrip[i + 1].ActualLatitude, this.selectedTrip[i + 1].ActualLongitude);
          }
        }
        // this will draw straight line between multiple points
        var polyline = new google.maps.Polyline({
          path: [startPt, endPt],
          strokeColor: 'brown',
          strokeWeight: 2,
          strokeOpacity: 1
        });

        polyline.setMap(this.map);
        this.bounds.extend(startPt);
        this.bounds.extend(endPt);

        // adding pushpin marker logic here
        let positionLatitude: any;
        let positionLongitude: any;
        if (sequence === 1) {
          positionLatitude = this.selectedTrip[i].PlannedLatitude;
          positionLongitude = this.selectedTrip[i].PlannedLongitude;
        } else if (sequence === 2) {
          positionLatitude = this.selectedTrip[i].ActualLatitude;
          positionLongitude = this.selectedTrip[i].ActualLongitude;
        }
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(positionLatitude, positionLongitude),
          map: this.map,
          icon: this.pinImage,
          title: (i + 1).toString(),
          // label: (i+1).toString()
        });

        // snippet for showing info window on marker click
        google.maps.event.addListener(marker, 'click', ((marker, i) => {
          let infowindowContent = '';
          if (this.selectedTrip[i].CustomerName) {
            infowindowContent += 'Customer Name : ' + this.selectedTrip[i].CustomerName + '<br>';
          } else {
            infowindowContent += 'Customer Name : ' + '-' + '<br>';
          }
          if (this.selectedTrip[i].TotalSale) {
            infowindowContent += 'Total Sale : ' + this.selectedTrip[i].TotalSale + '<br>';
          } else {
            infowindowContent += 'Total Sale : ' + '-' + '<br>';
          }
          if (this.selectedTrip[i].TotalAmount) {
            infowindowContent += 'Total Sale : ' + this.selectedTrip[i].TotalAmount + '<br>';
          } else {
            infowindowContent += 'Total Amount : ' + '-' + '<br>';
          }
          return () => {
            this.infowindow.setContent(infowindowContent);
            this.infowindow.open(this.map, marker);
          }
        })(marker, i));
      }
      this.map.fitBounds(this.bounds);
    }
  }
}
