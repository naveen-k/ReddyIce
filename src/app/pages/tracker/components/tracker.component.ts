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
export class TrackerComponent {

  todaysDate: any;
  allBranches: any;
  allTrips: any = {};
  showSpinner: boolean = false;
  trips: any = [];
  selectedDate: any = '2017-08-17';
  tripFilterOption: any = {
    uId: "0",
    tripDate: this.selectedDate,
    branchId: '1',
    isForAll: true,
    TripCode: 1,
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
  map:any;
  infowindow:any;
  bounds:any;
  pinColor:any;
  pinImage:any;

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
    console.log("this.isDistributor", this.isDistributor);

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
          console.log('this.trips', this.trips.length);
          if (this.trips[0]) {
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

  locationsActual = [];
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
    // this.locations = [];
    // this.locationsActual = [];
    for (var j = 0; j < this.selectedTrip.length; j++) {
      // if (j < 8) {
      //   this.locations.push([parseFloat(this.selectedTrip[j].PlannedLatitude),parseFloat(this.selectedTrip[j].PlannedLongitude)]);
      //   if (this.selectedTrip[j].ActualLatitude != null && this.selectedTrip[j].ActualLongitude != null)
      //   this.locationsActual.push([parseFloat(this.selectedTrip[j].ActualLatitude),parseFloat(this.selectedTrip[j].ActualLongitude)]);
      // }
    }
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
        zoom: 9,
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
        // for (var i = 0; i < this.selectedTrip.length - 1; i++) {

        //   // changing color of the marker icon based on condition
        //   if (this.selectedTrip[i].TktType === 'R') {
        //     this.pinColor = 'ffff00';    // yellow color for Did Not Service stops
        //   } else if (this.selectedTrip[i].TicketNumber == null) {
        //     this.pinColor = 'ff0000';    // red color for Skipped stops
        //   } else {
        //     this.pinColor = 'b8d5f4';          // default color for markers
        //   }

        //   // customising the marker icon here
        //   this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + this.pinColor,
        //     new google.maps.Size(21, 34),
        //     new google.maps.Point(0, 0),
        //     new google.maps.Point(10, 34));

        //   // start point of straight line
        //   if (this.selectedTrip[i])
        //     var startPt = new google.maps.LatLng(this.selectedTrip[i].ActualLatitude, this.selectedTrip[i].ActualLongitude);

        //   // adding check here to avoid 'undefined' condition
        //   var endPt = new google.maps.LatLng(this.selectedTrip[i + 1].ActualLatitude, this.selectedTrip[i + 1].ActualLongitude);

        //   // this will draw straight line between multiple points
        //   var polyline = new google.maps.Polyline({
        //     path: [startPt, endPt],
        //     strokeColor: 'brown',
        //     strokeWeight: 2,
        //     strokeOpacity: 1
        //   });

        //   polyline.setMap(this.map);
        //   this.bounds.extend(startPt);
        //   this.bounds.extend(endPt);

        //   // adding pushpin marker logic here
        //   var marker = new google.maps.Marker({
        //     position: new google.maps.LatLng(this.selectedTrip[i].ActualLatitude, this.selectedTrip[i].ActualLongitude),
        //     map: this.map,
        //     icon: this.pinImage
        //   });

        //   // snippet for showing info window on marker click
        //   google.maps.event.addListener(marker, 'click', ((marker, i) => {
        //     return () => {
        //       this.infowindow.setContent('Customer Name : ' + this.selectedTrip[i].CustomerName + '<br>' +
        //         'Total Sale : ' + this.selectedTrip[i].TotalSale + '<br>' +
        //         'Total Amount : ' + this.selectedTrip[i].TotalAmount);
        //       this.infowindow.open(this.map, marker);
        //     }
        //   })(marker, i));
        // }
        // this.map.fitBounds(this.bounds);
      } else {
        this.drawPolyline(google, 1);
      }
    });
  }

  drawPolyline(google, sequence) {
    for (var i = 0; i < this.selectedTrip.length; i++) {

      // changing color of the marker icon based on condition
      if (this.selectedTrip[i].TktType === 'R') {
        this.pinColor = 'ffff00';    // yellow color for Did Not Service stops
      } else if (this.selectedTrip[i].TicketNumber == null) {
        this.pinColor = 'ff0000';    // red color for Skipped stops
      } else {
        this.pinColor = 'b8d5f4';          // default color for markers
      }

      // customising the marker icon here
      this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (i+1).toString() + "|" + this.pinColor + "|000",
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
        title: (i+1).toString(),
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
