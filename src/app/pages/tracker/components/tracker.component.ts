import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../user-management/user-management.interface';
import { UserService } from '../../../shared/user.service';
import { TrackerService } from '../tracker.service';
import * as GoogleMapsLoader from 'google-maps';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';

@Component({
  templateUrl: 'tracker.component.html',
  styleUrls: ['./tracker.component.scss'],
})
export class TrackerComponent implements OnInit {
  searchObj: any = {
    userType: 'Internal'
  }
  todaysDate: any;
  allBranches: any;
  allTrips: any = {};
  showSpinner: boolean = false;
  trips: any = [];
  selectedDate: any;
  tripFilterOption: any = {
    uId: '0',
    tripDate: this.selectedDate,
    branchId: 0,
    isForAll: false,
    TripCode: 1,
    DriverName: 'abc',
    DistributorID: 0,
    DistributorName: '',
    DistributorCopackerID: 0
  };
  showBranchDropdown: boolean = false;
  planned: boolean = true;
  actual: boolean = false;
  both: boolean = false;
  isDistributorExist: boolean;
  userSubTitle: string = '';
  selectedTrip: any;
  tripStartDate: any;
  marker: any = [];
  driverSpecTrips: any = [];
  userId = localStorage.getItem('userId');

  user: User;

  // variables for drawing route
  map: any;
  infowindow: any;
  bounds: any;
  pinColor: any;
  pinImage: any;

  ///
  pinImage1: any;
  pinImage2: any;
  ///

  isDistributor: any;

  constructor(
    private _elementRef: ElementRef,
    private service: TrackerService,
    private userService: UserService,
    private notification: NotificationsService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId') || '';

    if (this.router.url === '/opentracker') {
      this.user = {} as User;
      this.isDistributor = false;
    } else {
      this.user = this.userService.getUser();

      if (this.user.Role.RoleID === 3 && this.user.IsSeasonal) {
        this.user.IsRIInternal = true;
        this.user.IsDistributor = false;
      }
      // get the user type: isDistributor or internal
      this.isDistributor = this.user.IsDistributor;
    }
    this.isDistributorExist = this.user.IsDistributor;
    this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + this.user.Distributor.DistributorName : '';

    const now = new Date();
    this.tripFilterOption['tripDate'] = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    this.selectedDate = this.service.formatDate({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
    this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };



    if (this.isDistributor) {
      this.searchObj.userType = 'External';
      this.actual = true;
      this.planned = false;
      this.tripFilterOption.branchId = 0;
      this.tripFilterOption.isForAll = false;
      this.typeChangeHandler(); // to load distributors
      this.tripFilterOption.DistributorMasterID = this.user.Distributor.DistributorMasterId;
    } else {
      this.tripFilterOption.branchId = 1;
      this.tripFilterOption.isForAll = true;
    }


    this.loadTrips();
  }

  sortBranches(branches) {
    // sort by name
    branches.sort(function (a, b) {
      const nameA = a.BranchName;
      const nameB = b.BranchName;
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
    if (this.selectedTrip) {
      this.selectedTrip = [];
    }
    if (this.driverSpecTrips) {
      this.driverSpecTrips = [];
    }
    if (this.driverOnBranch) {
      this.driverOnBranch = [];
    }
    if (this.driverOndistributor) {
      this.driverOndistributor = [];
    }
    this.showSpinner = true;
    this.service.getTrips(this.selectedDate, this.router.url === '/opentracker').subscribe((res) => {
      if (typeof res == 'object') {
        this.trips = res.DayEnd;
        var branchesArr = [];

        this.showSpinner = false;
        this.allBranches = [];
        var distributorArr = [];
        if (this.trips[0]) {
          if (this.searchObj.userType == 'Internal') {
            let tmpObj = {};
            for (var i = 0; i < this.trips.length; i++) {
              if (this.user.Role && this.user.Role.RoleID === 3 && this.user.IsSeasonal) {
                branchesArr.push(
                  {
                    BranchID: this.trips[i].BranchID,
                    BranchCode: this.trips[i].BranchCode,
                    BranchName: this.trips[i].BranchName
                  });
                tmpObj[this.trips[i].BranchID] = this.trips[i];
                continue;
              }
              if (!tmpObj[this.trips[i].BranchID]) {
                if (this.trips[i].isDistributor != 1) {
                  branchesArr.push(
                    {
                      BranchID: this.trips[i].BranchID,
                      BranchCode: this.trips[i].BranchCode,
                      BranchName: this.trips[i].BranchName
                    });
                  tmpObj[this.trips[i].BranchID] = this.trips[i];
                }
              }
            }
            this.sortBranches(branchesArr);
            this.allBranches = this.service.transformOptionsReddySelect(branchesArr, 'BranchID', 'BranchCode', 'BranchName');

          } else if (this.searchObj.userType == 'External') {
            let tmpObj = {};
            for (var i = 0; i < this.trips.length; i++) {
              if (!tmpObj[this.trips[i].DistributorName]) {
                distributorArr.push(
                  {
                    DistributorName: this.trips[i].DistributorName,
                    DistributorMasterID: this.trips[i].DistributorMasterID,
                  });
                tmpObj[this.trips[i].DistributorName] = this.trips[i];
              }
            }
            this.distributors = this.service.transformOptionsReddySelect(distributorArr, 'DistributorMasterID', 'DistributorName');

            if (this.user.IsDistributor) {
              this.distributorChangeHandler();
            }
          }
        }
        // this.drawMapPath();
      } else {
        this.trips = [];
        this.showSpinner = false;
      }
    }, (error) => {
      console.log(error);
      this.trips = [];
      this.showSpinner = false;
    });
  }

  // funtion to retrieve the time
  sliceTime(str) {
    if (str) {
      return str.slice(11, 16);
    }
  }

  // Filter TicketDetails based on the Trip selected
  IsUnplanned: boolean; // check if a trip is planned or unplanned
  fetchTicketDetailsByTrip(tripId) {
    this.showSpinner = true;
    this.selectedTrip = [];
    this.drawMapPath();
    this.service.getTripTicketsByTripID(tripId).subscribe(res => {
      this.showSpinner = false;
      this.IsUnplanned = res.Trips[0].IsUnplanned;
      if (this.IsUnplanned) { // if unplanned trip, map according 'Actual' scenario
        this.actual = true;
        this.planned = false;
      } else {
        this.actual = false;
        this.planned = true;
      }
      this.selectedTrip = res.Trips[0].TripTicketList; // creating array based on driver and tripcode selected
      this.tripStartDate = res.Trips[0].TripStartDate
      if (this.selectedTrip) {
        this.selectedTrip.sort(this.comparator); // sorting planned sequence
      }
      this.drawMapPath();
    })
  }

  // Fetch selected Date
  dateChangeHandler() {
    this.selectedDate = this.service.formatDate(this.tripFilterOption.tripDate);
    this.allBranches = [];
    this.distributors = [];
    this.tripFilterOption.branchId = [];
    if (this.isDistributor) {
      this.typeChangeHandler();
    } else {
      // this.loadBranches();
    }
    this.loadTrips();
    this.drawMapPath();
  }
  driverOnBranch = [];
  // Fetch selected Branch
  branchChangeHandler() {
    var routeNo;
    if (this.tripFilterOption.branchId) {
      this.driverOnBranch = [];
      for (var i = 0; i < this.trips.length; i++) {
        if (this.tripFilterOption.branchId == this.trips[i].BranchID) {
          if (this.trips[i].DriverName) {
            // removing extraa spaces
            this.trips[i].DriverName = this.trips[i].DriverName.split('  ').join('');
          }
          if (this.trips[i].RouteNumber.toString().indexOf("999") == -1) {
            routeNo = this.trips[i].RouteNumber;
          } else {
            routeNo = 'Unplanned';
          }
          this.driverOnBranch.push({
            DriverName: this.trips[i].DriverName,
            TripCode: this.trips[i].TripCode,
            TripID: this.trips[i].TripID,
            RouteNumber: routeNo
          });
        }
      }
      if (this.driverOnBranch && this.driverOnBranch.length > 0) {
        this.tripFilterOption.DriverName = this.driverOnBranch[0].DriverName;    // assigning in model
        // this.tripFilterOption.TripCode = this.driverOnBranch[0].TripCode;        // assigning in model
        this.driverChangeHandler();
      }

    } else {
      this.selectedTrip = [];
    }

    //this.loadTrips();
  }

  // Fetch selected Trip
  tripChangeHandler() {
    const tripId = this.driverSpecTrips.filter(t => t.TripCode === this.tripFilterOption.TripCode)[0].TripID;
    this.fetchTicketDetailsByTrip(tripId);
  }

  // Fetch selected Driver
  driverChangeHandler() {
    this.driverSpecTrips = [];
    if (this.searchObj.userType == 'Internal') {
      for (var i = 0; i < this.driverOnBranch.length; i++) {
        if (this.tripFilterOption.DriverName == this.driverOnBranch[i]['DriverName']) {
          //this.driverSpecTrips.push(this.driverOnBranch[i].TripCode);
          this.driverSpecTrips.push(
            {
              TripCode: this.driverOnBranch[i].TripCode,
              TripID: this.driverOnBranch[i].TripID,
              RouteNumber: this.driverOnBranch[i].RouteNumber
            }
          );
        }
      }
      if (this.driverSpecTrips[0]) {
        this.tripFilterOption.TripCode = this.driverSpecTrips[0].TripCode;
        this.tripChangeHandler();
      }
    } else if (this.searchObj.userType == 'External') {
      for (var i = 0; i < this.driverOndistributor.length; i++) {
        if (this.tripFilterOption.DriverName == this.driverOndistributor[i]['DriverName']) {
          //this.driverSpecTrips.push(this.driverOndistributor[i].TripCode);
          this.driverSpecTrips.push(
            {
              TripCode: this.driverOndistributor[i].TripCode,
              TripID: this.driverOndistributor[i].TripID
            }
          );
        }
      }
    }
    if (this.driverSpecTrips.length) {
      this.selectedTrip = [];
      this.tripFilterOption.TripCode = this.driverSpecTrips[0].TripCode;
      this.tripChangeHandler();
      // this.fetchTicketDetailsByTrip(this.tripFilterOption.TripCode);
    }
  }

  // Filter Markers in the Google Map based on Sequence Radio Button selection
  sequenceChangeHandler(sequence) {
    if (sequence === 1) {
      this.planned = true;
      this.actual = false;
    } else if (sequence === 2) {
      this.actual = true;
      this.planned = false;
    } else {
      this.planned = false;
      this.actual = false;
    }
    this.drawMapPath();
  }

  drawMapPath() {
    let el = this._elementRef.nativeElement.querySelector('.google-maps');
    GoogleMapsLoader.load((google) => {
      this.map = new google.maps.Map(el, {
        center: new google.maps.LatLng(32.736259, -96.864586),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });
      this.infowindow = new google.maps.InfoWindow();
      this.bounds = new google.maps.LatLngBounds();
      this.pinColor = "0000ff";
      this.pinImage = new google.maps.MarkerImage(
        "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + this.pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

      ///
      this.pinImage1 = new google.maps.MarkerImage(
        "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + this.pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

      this.pinImage2 = new google.maps.MarkerImage(
        "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + this.pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));
      ///

      //const selectedTrip = [{ PlannedLatitude: '32.736259', PlannedLongitude: '-96.864586' }, { PlannedLatitude: '32.7498', PlannedLongitude: '-96.8720' }, { PlannedLatitude: '32.7905', PlannedLongitude: '-96.8104' }, { PlannedLatitude: '32.8481', PlannedLongitude: '-96.8512' }]

      // If Planned Sequence Radio button is selected
      if (this.planned) {
        // this.drawPolyline(google, 1);
        this.drawRoute(google, 1, this.selectedTrip);
      } else if (this.actual) {
        //this.drawPolyline(google, 2);
        this.drawRoute(google, 2, this.selectedTrip);
      } else {
        //this.drawPolyline(google, 3);
        this.drawRoute(google, 1, this.selectedTrip);
        this.drawRoute(google, 2, this.selectedTrip);
      }
    });
  }

  // function to sort the selectedTrip array by PlannedSequence
  comparator(a, b) {
    return a["PlannedSequence"] - b["PlannedSequence"];
  }

  pinTextColor = '';

  drawRoute(google: any, sequence: number, trips: any[]) {
    if (!trips || !trips.length) { return false };
    trips = trips.slice(0);
    // if (sequence === 2) {
    //   trips.sort((a, b) => { return a.ActualSequence - b.ActualSequence })
    // }
    debugger;
    for (let i = 0; i < trips.length; i++) {
      if(sequence == 2) {
        // changing color of the marker icon based on condition
        if (trips[i].TicketTypeID === 29) {
          this.pinColor = 'ffff00';   // yellow color for Did Not Service stops
          this.pinTextColor = '000';
          this.selectedTrip[i].pinColor = '#' + this.pinColor;
          this.selectedTrip[i].pinTextColor = '#' + this.pinTextColor;
        } else if (trips[i].OrderID == null) {
          this.pinColor = '0000ff';   // blue color for Unplanned Service
          this.pinTextColor = 'fff';
          this.selectedTrip[i].pinColor = '#' + this.pinColor;
          this.selectedTrip[i].pinTextColor = '#' + this.pinTextColor;
        } else if (trips[i].OrderID != null && trips[i].TicketNumber !== null) {
          this.pinColor = '90EE90';   // lightgreen color for Planned Service
          this.pinTextColor = '000';
          this.selectedTrip[i].pinColor = '#' + this.pinColor;
          this.selectedTrip[i].pinTextColor = '#' + this.pinTextColor;
        } else if (trips[i].OrderID != null && trips[i].TicketNumber == null) {
          this.pinColor = 'ff0000';   // red color for Skipped stops
          this.pinTextColor = 'fff';
          this.selectedTrip[i].pinColor = '#' + this.pinColor;
          this.selectedTrip[i].pinTextColor = '#' + this.pinTextColor;
        }
      }
      if (sequence === 1) {
        this.pinColor = '999900';   // red color for Skipped stops
        this.pinTextColor = 'fff';
        this.selectedTrip[i].pinColor = '#' + this.pinColor;
        this.selectedTrip[i].pinTextColor = '#' + this.pinTextColor;
      }


      // customising the marker icon here
      if (sequence === 2) {
        this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (trips[i].ActualSequence || '').toString() + "|" + this.pinColor + "|" + this.pinTextColor,
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34));
      } else if (sequence === 1) {
        if (trips[i].PlannedSequence != null) {
          this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (trips[i].PlannedSequence || i + 1).toString() + "|" + this.pinColor + "|" + this.pinTextColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));
        }
      }

      // adding pushpin marker logic here
      let positionLatitude: any;
      let positionLongitude: any;

      // start point of straight line
      if (sequence === 1) {
        if (trips[i].PlannedLatitude != null && trips[i].PlannedLongitude != null
          && trips[i].PlannedLatitude != "" && trips[i].PlannedLongitude != ""
          && trips[i].PlannedLatitude != "0.0" && trips[i].PlannedLongitude != "0.0") {
          var startPt = new google.maps.LatLng(trips[i].PlannedLatitude, trips[i].PlannedLongitude);
          positionLatitude = trips[i].PlannedLatitude;
          positionLongitude = trips[i].PlannedLongitude;
        }
      } else if (sequence === 2) {
        if (trips[i].ActualLatitude &&
          trips[i].ActualLongitude &&
          trips[i].ActualLatitude != "0.0" &&
          trips[i].ActualLongitude != "0.0") {
          var startPt = new google.maps.LatLng(trips[i].ActualLatitude, trips[i].ActualLongitude);
          positionLatitude = trips[i].ActualLatitude;
          positionLongitude = trips[i].ActualLongitude;
        } else if (trips[i].PlannedLatitude &&
          trips[i].PlannedLongitude &&
          trips[i].PlannedLatitude != "0.0" &&
          trips[i].PlannedLongitude != "0.0") {
          var startPt = new google.maps.LatLng(trips[i].PlannedLatitude, trips[i].PlannedLongitude);
          positionLatitude = trips[i].PlannedLatitude;
          positionLongitude = trips[i].PlannedLongitude;
        }
      }


      // end point fo straight line
      if (sequence === 1) {
        // adding check here to avoid 'undefined' condition
        if (trips[i + 1]) {
          if (trips[i + 1].PlannedLatitude != null && trips[i + 1].PlannedLongitude != null
            && trips[i + 1].PlannedLatitude != "" && trips[i + 1].PlannedLongitude != ""
            && trips[i + 1].PlannedLatitude != "0.0" && trips[i + 1].PlannedLongitude != "0.0") {
            var endPt = new google.maps.LatLng(trips[i + 1].PlannedLatitude, trips[i + 1].PlannedLongitude);
          }
        }
      } else if (sequence === 2) {
        // adding check here to avoid 'undefined' condition
        if (trips[i + 1]) {
          if (trips[i + 1].ActualLatitude &&
            trips[i + 1].ActualLongitude &&
            trips[i + 1].ActualLatitude != "0.0" &&
            trips[i + 1].ActualLongitude != "0.0") {
            var endPt = new google.maps.LatLng(trips[i + 1].ActualLatitude, trips[i + 1].ActualLongitude);
          } else if (trips[i + 1].PlannedLatitude &&
            trips[i + 1].PlannedLongitude &&
            trips[i + 1].PlannedLatitude != "0.0" &&
            trips[i + 1].PlannedLongitude != "0.0") {
            var endPt = new google.maps.LatLng(trips[i + 1].PlannedLatitude, trips[i + 1].PlannedLongitude);
          }

        }
      }

      var strokeColour = '';
      if (sequence == 2) {
        strokeColour = 'brown'
      } else {
        strokeColour = '#999900'
      }
      if (startPt && endPt) {
        var polyline = new google.maps.Polyline({
          path: [startPt, endPt],
          strokeColor: strokeColour,
          strokeWeight: 2,
          strokeOpacity: 1
        });
        polyline.setMap(this.map);
        this.bounds.extend(startPt);
        this.bounds.extend(endPt);
      }

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(positionLatitude, positionLongitude),
        map: this.map,
        icon: this.pinImage
      });

      google.maps.event.addListener(marker, 'click', ((marker, i) => {
        let infowindowContent = '';
        if (trips[i].CustomerName) {
          infowindowContent += 'Customer Name : ' + trips[i].CustomerName + '<br>';
        } else {
          infowindowContent += 'Customer Name : ' + '-' + '<br>';
        }
        if (trips[i].TotalSale != null || trips[i].TotalSale != undefined
          || trips[i].TaxAmount != null || trips[i].TaxAmount != undefined) {
          // var totalInvoice = trips[i].TotalSale + trips[i].TaxAmount;
          var totalInvoice = trips[i].TotalSale.fpArithmetic("+", trips[i].TaxAmount || 0);
          if (typeof totalInvoice === "number" && isFinite(totalInvoice) && Math.floor(totalInvoice) === totalInvoice) {
            totalInvoice = totalInvoice + ".00";
          }
          infowindowContent += 'Total Invoice : $' + totalInvoice + '<br>';
        } else {
          infowindowContent += 'Total Invoice : $' + '0.00' + '<br>';
        }

        if (trips[i].CashAmount != null || trips[i].CashAmount != undefined
          || trips[i].CheckAmount != null || trips[i].CheckAmount != undefined) {
          var receivedAmt = trips[i].CashAmount + trips[i].CheckAmount;
          if (typeof receivedAmt === "number" && isFinite(receivedAmt) && Math.floor(receivedAmt) === receivedAmt) {
            receivedAmt = receivedAmt + ".00";
          }
          infowindowContent += 'Total Received Amount : $' + receivedAmt + '<br>';
        } else {
          infowindowContent += 'Total Received Amount : $' + '0.00' + '<br>';
        }
        return () => {
          this.infowindow.setContent(infowindowContent);
          this.infowindow.open(this.map, marker);
        }
      })(marker, i));


      this.map.fitBounds(this.bounds);      // auto-zoom
      this.map.panToBounds(this.bounds);    // auto-center
    }
  }

  viewTicket(ticketID) {
    // ticketID = 3212;
    if (ticketID) {
      window.open(environment.reportEndpoint + "?Rtype=TK&TicketID=" + ticketID, "Ticket", "width=900,height=600,resizable=yes,scrollbars=1");
    } else {
      this.notification.error("Ticket preview unavailable!!");
    }
  }

  distributors: any = [];
  typeChangeHandler() {
    if (this.searchObj.userType == 'External') {
      this.actual = true;
      this.planned = false;
      // this.tripFilterOption.DistributorMasterID = this.user.Distributor.DistributorMasterId;
    } else {
      this.actual = false;
      this.planned = true;
    }
    this.tripFilterOption.branchId = null;
    this.tripFilterOption.DistributorMasterID = null;
    this.loadTrips();
    this.drawMapPath();
  }

  DistributorCopackerID = 0;
  DistributorTrips = [];
  driverOndistributor = [];
  distributorChangeHandler() {
    this.driverOndistributor = [];
    for (var i = 0; i < this.trips.length; i++) {
      if (this.tripFilterOption.DistributorMasterID == this.trips[i].DistributorMasterID) {
        this.driverOndistributor.push({
          DriverName: this.trips[i].DriverName,
          TripCode: this.trips[i].TripCode,
          TripID: this.trips[i].TripID
        });
      }
    }
    if (this.driverOndistributor.length > 0) {
      this.tripFilterOption.DriverName = this.driverOndistributor[0].DriverName;    // assigning in model
      this.tripFilterOption.TripCode = this.driverOndistributor[0].TripCode;        // assigning in model
    }
    this.driverChangeHandler();
    // this.loadTrips();
  }
}
