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

    this.user = this.userService.getUser();
    console.log(this.user);
    this.isDistributorExist = this.user.IsDistributor;
    this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + this.user.Distributor.DistributorName : '';

    const now = new Date();
    this.tripFilterOption['tripDate'] = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    this.selectedDate = this.service.formatDate({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
    this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

    // get the user type: isDistributor or internal
    this.isDistributor = this.userService.getUser().IsDistributor;

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
    if (!this.user.IsRIInternal) {
      if (this.user.Role.RoleID === 3) {
        if (this.user.IsSeasonal) {
          this.showBranchDropdown = true;
        } else {
          this.showBranchDropdown = false;
        }
      }
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
        this.trips = res.Trips;
        var branchesArr = [];
        console.log('this.trips', this.trips.length);

        this.showSpinner = false;
        this.allBranches = [];
        var distributorArr = [];
        if (this.trips[0]) {
          if (this.searchObj.userType == 'Internal') {
            let tmpObj = {};
            for (var i = 0; i < this.trips.length; i++) {
              if (!tmpObj[this.trips[i].BranchID]) {
                console.log('isDistributor: ', this.trips[i].isDistributor);
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
            console.log('branchesArr', branchesArr);
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
          }
        }
        this.drawMapPath();
      } else {
        this.trips = [];
        this.showSpinner = false;
      }
      if (this.user.IsDistributor) {
        this.distributorChangeHandler();
      } else {
        if (this.allBranches && this.allBranches.length > 0) {
          this.branchChangeHandler();
        }
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
  fetchTicketDetailsByTrip(TripCode) {
    for (var i = 0; i < this.trips.length; i++) {
      if (parseInt(TripCode) === this.trips[i].TripCode &&
        this.tripFilterOption.DriverName == this.trips[i].DriverName) {
        console.log('isUnplanned', this.trips[i].IsUnplanned);
        this.IsUnplanned = this.trips[i].IsUnplanned;
        if (this.IsUnplanned) { // if unplanned trip, map according 'Actual' scenario
          this.actual = true;
          this.planned = false;
        } else {
          this.actual = false;
          this.planned = true;
        }
        this.selectedTrip = this.trips[i].TripTicketList; // creating array based on driver and tripcode selected
        this.tripStartDate = this.trips[i].TripStartDate
      }
    }
    console.log('this.selectedTrip', this.selectedTrip);
    if (this.selectedTrip && this.planned) {
      this.selectedTrip.sort(this.comparator); // sorting planned sequence
    }
    this.drawMapPath();
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
    console.log('tripFilterOption.branchId', this.tripFilterOption.branchId);
    // this.tripFilterOption.DriverName = this.trips[0].DriverName;    // assigning in model
    // this.tripFilterOption.TripCode = this.trips[0].TripCode;        // assigning in model

    if (this.tripFilterOption.branchId) {
      this.driverOnBranch = [];
      for (var i = 0; i < this.trips.length; i++) {
        if (this.tripFilterOption.branchId == this.trips[i].BranchID) {
          this.driverOnBranch.push({
            DriverName: this.trips[i].DriverName,
            TripCode: this.trips[i].TripCode
          });
        }
      }
      console.log(this.driverOnBranch);
      if (this.driverOnBranch && this.driverOnBranch.length > 0) {
        this.tripFilterOption.DriverName = this.driverOnBranch[0].DriverName;    // assigning in model
        this.tripFilterOption.TripCode = this.driverOnBranch[0].TripCode;        // assigning in model
        this.driverChangeHandler();
      }

    } else {
      this.selectedTrip = [];
    }

    //this.loadTrips();
  }

  // Fetch selected Trip
  tripChangeHandler() {
    console.log('TripCode', this.tripFilterOption.TripCode);
    this.fetchTicketDetailsByTrip(this.tripFilterOption.TripCode);
  }

  // Fetch selected Driver
  driverChangeHandler() {
    console.log('DriverName', this.tripFilterOption.DriverName);
    this.driverSpecTrips = [];
    if (this.searchObj.userType == 'Internal') {
      for (var i = 0; i < this.driverOnBranch.length; i++) {
        if (this.tripFilterOption.DriverName == this.driverOnBranch[i]['DriverName']) {
          //this.driverSpecTrips.push(this.driverOnBranch[i].TripCode);
          this.driverSpecTrips.push(
            {
              TripCode: this.driverOnBranch[i].TripCode
            }
          );
        }
      }
      if (this.driverSpecTrips[0]) {
        this.tripFilterOption.TripCode = this.driverSpecTrips[0].TripCode;
      }
    } else if (this.searchObj.userType == 'External') {
      for (var i = 0; i < this.driverOndistributor.length; i++) {
        if (this.tripFilterOption.DriverName == this.driverOndistributor[i]['DriverName']) {
          //this.driverSpecTrips.push(this.driverOndistributor[i].TripCode);
          this.driverSpecTrips.push(
            {
              TripCode: this.driverOndistributor[i].TripCode
            }
          );
        }
      }
    }
    console.log('this.driverSpecTrips', this.driverSpecTrips);
    if (this.driverSpecTrips.length > 0) {
      this.selectedTrip = [];
      this.fetchTicketDetailsByTrip(this.tripFilterOption.TripCode);
    } else {
      this.selectedTrip = [];
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
        this.drawPolyline(google, 1);
      } else if (this.actual) {
        this.drawPolyline(google, 2);
      } else {
        this.drawPolyline(google, 3);
      }
    });
  }

  // function to sort the selectedTrip array by PlannedSequence
  comparator(a, b) {
    return a["PlannedSequence"] - b["PlannedSequence"];
  }

  pinTextColor = '';
  // function to draw the polyline on map
  drawPolyline(google, sequence) {
    if (this.selectedTrip && this.selectedTrip.length >= 1) {
      for (var i = 0; i < this.selectedTrip.length; i++) {

        // changing color of the marker icon based on condition
        if (this.selectedTrip[i].TicketTypeID === 29) {
          this.pinColor = 'ffff00';   // yellow color for Did Not Service stops
          this.pinTextColor = '000';
          console.log("here : ", i);
        } else if (this.selectedTrip[i].OrderID == null) {
          this.pinColor = '0000ff';   // blue color for Unplanned Service
          this.pinTextColor = 'fff';
        } else if (this.selectedTrip[i].OrderID != null && this.selectedTrip[i].TicketNumber !== null) {
          this.pinColor = '90EE90';   // lightgreen color for Planned Service
          this.pinTextColor = '000';
        } else if (this.selectedTrip[i].OrderID != null && this.selectedTrip[i].TicketNumber == null) {
          this.pinColor = 'ff0000';   // red color for Skipped stops
          this.pinTextColor = 'fff';
        }

        // customising the marker icon here
        if (sequence === 2) {
          // if (this.selectedTrip[i].ActualSequence != null) {
          //   this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (this.selectedTrip[i].ActualSequence).toString() + "|" + this.pinColor + "|fff",
          //     new google.maps.Size(21, 34),
          //     new google.maps.Point(0, 0),
          //     new google.maps.Point(10, 34));
          // }
          if (this.selectedTrip[i].ActualSequence != null) {
            this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (this.selectedTrip[i].ActualSequence).toString() + "|" + this.pinColor + "|" + this.pinTextColor,
              new google.maps.Size(21, 34),
              new google.maps.Point(0, 0),
              new google.maps.Point(10, 34));
          }
        } else if (sequence === 1) {
          // if (this.selectedTrip[i].PlannedSequence != null) {
          //   this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (this.selectedTrip[i].PlannedSequence).toString() + "|" + this.pinColor + "|fff",
          //     new google.maps.Size(21, 34),
          //     new google.maps.Point(0, 0),
          //     new google.maps.Point(10, 34));
          // }
          if (this.selectedTrip[i].PlannedSequence != null) {
            this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (this.selectedTrip[i].PlannedSequence).toString() + "|" + this.pinColor + "|" + this.pinTextColor,
              new google.maps.Size(21, 34),
              new google.maps.Point(0, 0),
              new google.maps.Point(10, 34));
          }
        } else {
          if (this.selectedTrip[i].ActualSequence != null) {
            this.pinImage2 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (this.selectedTrip[i].ActualSequence).toString() + "|" + this.pinColor + "|" + this.pinTextColor,
              new google.maps.Size(21, 34),
              new google.maps.Point(0, 0),
              new google.maps.Point(10, 34));
          }
          if (this.selectedTrip[i].PlannedSequence != null) {
            this.pinImage1 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (this.selectedTrip[i].PlannedSequence).toString() + "|" + this.pinColor + "|" + this.pinTextColor,
              new google.maps.Size(21, 34),
              new google.maps.Point(0, 0),
              new google.maps.Point(10, 34));
          }
        }

        // start point of straight line
        if (sequence === 1) {
          if (this.selectedTrip[i].PlannedLatitude != null && this.selectedTrip[i].PlannedLongitude != null
            && this.selectedTrip[i].PlannedLatitude != "" && this.selectedTrip[i].PlannedLongitude != ""
            && this.selectedTrip[i].PlannedLatitude != "0.0" && this.selectedTrip[i].PlannedLongitude != "0.0") {
            var startPt = new google.maps.LatLng(this.selectedTrip[i].PlannedLatitude, this.selectedTrip[i].PlannedLongitude);
          }
        } else if (sequence === 2) {
          if (this.selectedTrip[i].ActualLatitude != null && this.selectedTrip[i].ActualLongitude != null
            && this.selectedTrip[i].ActualLatitude != "" && this.selectedTrip[i].ActualLongitude != ""
            && this.selectedTrip[i].ActualLatitude != "0.0" && this.selectedTrip[i].ActualLongitude != "0.0") {
            var startPt = new google.maps.LatLng(this.selectedTrip[i].ActualLatitude, this.selectedTrip[i].ActualLongitude);
          }
        } else {
          if (this.selectedTrip[i].PlannedLatitude != null && this.selectedTrip[i].PlannedLongitude != null
            && this.selectedTrip[i].PlannedLatitude != "" && this.selectedTrip[i].PlannedLongitude != ""
            && this.selectedTrip[i].PlannedLatitude != "0.0" && this.selectedTrip[i].PlannedLongitude != "0.0") {
            var startPtP = new google.maps.LatLng(this.selectedTrip[i].PlannedLatitude, this.selectedTrip[i].PlannedLongitude);
          }
          if (this.selectedTrip[i].ActualLatitude != null && this.selectedTrip[i].ActualLongitude != null
            && this.selectedTrip[i].ActualLatitude != "" && this.selectedTrip[i].ActualLongitude != ""
            && this.selectedTrip[i].ActualLatitude != "0.0" && this.selectedTrip[i].ActualLongitude != "0.0") {
            var startPtA = new google.maps.LatLng(this.selectedTrip[i].ActualLatitude, this.selectedTrip[i].ActualLongitude);
          }
        }

        // end point fo straight line
        if (sequence === 1) {
          // adding check here to avoid 'undefined' condition
          if (this.selectedTrip[i + 1]) {
            if (this.selectedTrip[i + 1].PlannedLatitude != null && this.selectedTrip[i + 1].PlannedLongitude != null
              && this.selectedTrip[i + 1].PlannedLatitude != "" && this.selectedTrip[i + 1].PlannedLongitude != ""
              && this.selectedTrip[i + 1].PlannedLatitude != "0.0" && this.selectedTrip[i + 1].PlannedLongitude != "0.0") {
              var endPt = new google.maps.LatLng(this.selectedTrip[i + 1].PlannedLatitude, this.selectedTrip[i + 1].PlannedLongitude);
            }
          }
        } else if (sequence === 2) {
          // adding check here to avoid 'undefined' condition
          if (this.selectedTrip[i + 1]) {
            if (this.selectedTrip[i + 1].ActualLatitude != null && this.selectedTrip[i + 1].ActualLongitude != null
              && this.selectedTrip[i + 1].ActualLatitude != "" && this.selectedTrip[i + 1].ActualLongitude != ""
              && this.selectedTrip[i + 1].ActualLatitude != "0.0" && this.selectedTrip[i + 1].ActualLongitude != "0.0") {
              var endPt = new google.maps.LatLng(this.selectedTrip[i + 1].ActualLatitude, this.selectedTrip[i + 1].ActualLongitude);
            }
          }
        } else {
          if (this.selectedTrip[i + 1]) {
            if (this.selectedTrip[i + 1].PlannedLatitude != null && this.selectedTrip[i + 1].PlannedLongitude != null
              && this.selectedTrip[i + 1].PlannedLatitude != "" && this.selectedTrip[i + 1].PlannedLongitude != ""
              && this.selectedTrip[i + 1].PlannedLatitude != "0.0" && this.selectedTrip[i + 1].PlannedLongitude != "0.0") {
              var endPtP = new google.maps.LatLng(this.selectedTrip[i + 1].PlannedLatitude, this.selectedTrip[i + 1].PlannedLongitude);
            }
          }
          if (this.selectedTrip[i + 1]) {
            if (this.selectedTrip[i + 1].ActualLatitude != null && this.selectedTrip[i + 1].ActualLongitude != null
              && this.selectedTrip[i + 1].ActualLatitude != "" && this.selectedTrip[i + 1].ActualLongitude != ""
              && this.selectedTrip[i + 1].ActualLatitude != "0.0" && this.selectedTrip[i + 1].ActualLongitude != "0.0") {
              var endPtA = new google.maps.LatLng(this.selectedTrip[i + 1].ActualLatitude, this.selectedTrip[i + 1].ActualLongitude);
            }
          }
        }

        // this will draw straight line between multiple points
        if (sequence != 3) {
          var strokeColour = '';
          if (sequence == 2) {
            strokeColour = 'blue'
          } else {
            strokeColour = 'brown'
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
        } else {
          if (startPtA && endPtA) {
            var polyline2 = new google.maps.Polyline({
              path: [startPtA, endPtA],
              strokeColor: 'blue',
              strokeWeight: 2,
              strokeOpacity: 1
            });
            polyline2.setMap(this.map);
            this.bounds.extend(startPtA);
            this.bounds.extend(endPtA);
          }

          if (startPtP && endPtP) {
            var polyline1 = new google.maps.Polyline({
              path: [startPtP, endPtP],
              strokeColor: 'brown',
              strokeWeight: 2,
              strokeOpacity: 1
            });
            polyline1.setMap(this.map);
            this.bounds.extend(startPtP);
            this.bounds.extend(endPtP);
          }
        }

        // adding pushpin marker logic here
        let positionLatitude: any;
        let positionLongitude: any;

        let positionLatitude1: any;
        let positionLatitude2: any;
        let positionLongitude1: any;
        let positionLongitude2: any;
        if (sequence === 1) {
          if (this.selectedTrip[i].PlannedLatitude != null && this.selectedTrip[i].PlannedLongitude != null
            && this.selectedTrip[i].PlannedLatitude != "" && this.selectedTrip[i].PlannedLongitude != ""
            && this.selectedTrip[i].PlannedLatitude != "0.0" && this.selectedTrip[i].PlannedLongitude != "0.0") {
            positionLatitude = this.selectedTrip[i].PlannedLatitude;
            positionLongitude = this.selectedTrip[i].PlannedLongitude;
          }
        } else if (sequence === 2) {
          if (this.selectedTrip[i].ActualLatitude != null && this.selectedTrip[i].ActualLongitude != null
            && this.selectedTrip[i].ActualLatitude != "" && this.selectedTrip[i].ActualLongitude != ""
            && this.selectedTrip[i].ActualLatitude != "0.0" && this.selectedTrip[i].ActualLongitude != "0.0") {
            positionLatitude = this.selectedTrip[i].ActualLatitude;
            positionLongitude = this.selectedTrip[i].ActualLongitude;
          }
        } else {
          if (this.selectedTrip[i].PlannedLatitude != null && this.selectedTrip[i].PlannedLongitude != null
            && this.selectedTrip[i].PlannedLatitude != "" && this.selectedTrip[i].PlannedLongitude != ""
            && this.selectedTrip[i].PlannedLatitude != "0.0" && this.selectedTrip[i].PlannedLongitude != "0.0"
          ) {
            positionLatitude1 = this.selectedTrip[i].PlannedLatitude;
            positionLongitude1 = this.selectedTrip[i].PlannedLongitude;
          }
          if (this.selectedTrip[i].ActualLatitude != null && this.selectedTrip[i].ActualLongitude != null
            && this.selectedTrip[i].ActualLatitude != "" && this.selectedTrip[i].ActualLongitude != ""
            && this.selectedTrip[i].ActualLatitude != "0.0" && this.selectedTrip[i].ActualLongitude != "0.0") {
            positionLatitude2 = this.selectedTrip[i].ActualLatitude;
            positionLongitude2 = this.selectedTrip[i].ActualLongitude;
          }
        }
        if (sequence != 3) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(positionLatitude, positionLongitude),
            map: this.map,
            icon: this.pinImage,
            title: (i + 1).toString(),
            // label: (i+1).toString()
          });
        } else {
          var marker1 = new google.maps.Marker({
            position: new google.maps.LatLng(positionLatitude1, positionLongitude1),
            map: this.map,
            icon: this.pinImage1,
            title: (i + 1).toString(),
          });
          var marker2 = new google.maps.Marker({
            position: new google.maps.LatLng(positionLatitude2, positionLongitude2),
            map: this.map,
            icon: this.pinImage2,
            title: (i + 1).toString(),
          });
        }

        // snippet for showing info window on marker click
        if (sequence != 3) {
          google.maps.event.addListener(marker, 'click', ((marker, i) => {
            let infowindowContent = '';
            if (this.selectedTrip[i].CustomerName) {
              infowindowContent += 'Customer Name : ' + this.selectedTrip[i].CustomerName + '<br>';
            } else {
              infowindowContent += 'Customer Name : ' + '-' + '<br>';
            }
            if (this.selectedTrip[i].TotalSale != null || this.selectedTrip[i].TotalSale != undefined
              || this.selectedTrip[i].TaxAmount != null || this.selectedTrip[i].TaxAmount != undefined) {
              var totalInvoice = this.selectedTrip[i].TotalSale + this.selectedTrip[i].TaxAmount;
              if (typeof totalInvoice === "number" && isFinite(totalInvoice) && Math.floor(totalInvoice) === totalInvoice) {
                totalInvoice = totalInvoice + ".00";
              }
              infowindowContent += 'Total Invoice : $' + totalInvoice + '<br>';
            } else {
              infowindowContent += 'Total Invoice : $' + '0.00' + '<br>';
            }
            // if (this.selectedTrip[i].TotalAmount) {
            //   infowindowContent += 'Total Amount : $' + this.selectedTrip[i].TotalAmount + '<br>';
            // } else {
            //   infowindowContent += 'Total Amount : ' + '-' + '<br>';
            // }
            if (this.selectedTrip[i].CashAmount != null || this.selectedTrip[i].CashAmount != undefined
              || this.selectedTrip[i].CheckAmount != null || this.selectedTrip[i].CheckAmount != undefined) {
              var receivedAmt = this.selectedTrip[i].CashAmount + this.selectedTrip[i].CheckAmount;
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
        } else {
          google.maps.event.addListener(marker1, 'click', ((marker1, i) => {
            let infowindowContent = '';
            if (this.selectedTrip[i].CustomerName) {
              infowindowContent += 'Customer Name : ' + this.selectedTrip[i].CustomerName + '<br>';
            } else {
              infowindowContent += 'Customer Name : ' + '-' + '<br>';
            }
            if (this.selectedTrip[i].TotalSale != null || this.selectedTrip[i].TotalSale != undefined ||
              this.selectedTrip[i].TaxAmount != null || this.selectedTrip[i].TaxAmount != undefined) {
              var totalInvoice = this.selectedTrip[i].TotalSale + this.selectedTrip[i].TaxAmount;
              if (typeof totalInvoice === "number" && isFinite(totalInvoice) && Math.floor(totalInvoice) === totalInvoice) {
                totalInvoice = totalInvoice + ".00";
              }
              infowindowContent += 'Total Invoice : $' + totalInvoice + '<br>';
            } else {
              infowindowContent += 'Total Invoice : $' + '0' + '<br>';
            }
            if (this.selectedTrip[i].CashAmount != null || this.selectedTrip[i].CashAmount != undefined
              || this.selectedTrip[i].CheckAmount != null || this.selectedTrip[i].CheckAmount != undefined) {
              var receivedAmt = this.selectedTrip[i].CashAmount + this.selectedTrip[i].CheckAmount;
              if (typeof receivedAmt === "number" && isFinite(receivedAmt) && Math.floor(receivedAmt) === receivedAmt) {
                receivedAmt = receivedAmt + ".00";
              }
              infowindowContent += 'Total Received Amount : $' + receivedAmt + '<br>';
            } else {
              infowindowContent += 'Total Received Amount : $' + '0' + '<br>';
            }
            // if (this.selectedTrip[i].TotalAmount) {
            //   infowindowContent += 'Total Sale : ' + this.selectedTrip[i].TotalAmount + '<br>';
            // } else {
            //   infowindowContent += 'Total Amount : ' + '-' + '<br>';
            // }
            return () => {
              this.infowindow.setContent(infowindowContent);
              this.infowindow.open(this.map, marker1);
            }
          })(marker1, i));
          google.maps.event.addListener(marker2, 'click', ((marker2, i) => {
            let infowindowContent = '';
            if (this.selectedTrip[i].CustomerName) {
              infowindowContent += 'Customer Name : ' + this.selectedTrip[i].CustomerName + '<br>';
            } else {
              infowindowContent += 'Customer Name : ' + '-' + '<br>';
            }
            if (this.selectedTrip[i].TotalSale != null || this.selectedTrip[i].TotalSale != undefined ||
              this.selectedTrip[i].TaxAmount != null || this.selectedTrip[i].TaxAmount != undefined) {
              var totalInvoice = this.selectedTrip[i].TotalSale + this.selectedTrip[i].TaxAmount;
              if (typeof totalInvoice === "number" && isFinite(totalInvoice) && Math.floor(totalInvoice) === totalInvoice) {
                totalInvoice = totalInvoice + ".00";
              }
              infowindowContent += 'Total Invoice : $' + totalInvoice + '<br>';
            } else {
              infowindowContent += 'Total Invoice : $' + '0' + '<br>';
            }
            if (this.selectedTrip[i].CashAmount != null || this.selectedTrip[i].CashAmount != undefined
              || this.selectedTrip[i].CheckAmount != null || this.selectedTrip[i].CheckAmount != undefined) {
              var receivedAmt = this.selectedTrip[i].CashAmount + this.selectedTrip[i].CheckAmount;
              if (typeof receivedAmt === "number" && isFinite(receivedAmt) && Math.floor(receivedAmt) === receivedAmt) {
                receivedAmt = receivedAmt + ".00";
              }
              infowindowContent += 'Total Received Amount : $' + receivedAmt + '<br>';
            } else {
              infowindowContent += 'Total Received Amount : $' + '0' + '<br>';
            }
            return () => {
              this.infowindow.setContent(infowindowContent);
              this.infowindow.open(this.map, marker2);
            }
          })(marker2, i));
        }
      }
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
    this.loadTrips();
  }

  DistributorCopackerID = 0;
  DistributorTrips = [];
  driverOndistributor = [];
  distributorChangeHandler() {
    console.log(this.tripFilterOption.DistributorMasterID);
    this.driverOndistributor = [];
    for (var i = 0; i < this.trips.length; i++) {
      if (this.tripFilterOption.DistributorMasterID == this.trips[i].DistributorMasterID) {
        this.driverOndistributor.push({
          DriverName: this.trips[i].DriverName,
          TripCode: this.trips[i].TripCode
        });
      }
    }
    console.log(this.driverOndistributor);
    if (this.driverOndistributor.length > 0) {
      this.tripFilterOption.DriverName = this.driverOndistributor[0].DriverName;    // assigning in model
      this.tripFilterOption.TripCode = this.driverOndistributor[0].TripCode;        // assigning in model
    }
    this.driverChangeHandler();
    // this.loadTrips();
  }
}
