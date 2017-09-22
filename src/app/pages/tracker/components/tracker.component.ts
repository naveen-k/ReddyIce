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
    TripID: 17003,
  };

  planned: boolean = true;
  actual: boolean = false;
  both: boolean = false;

  selectedTrip: any;
  selectedTripp: any = [
    {
      "PlannedLatitude": 32.736259,
      "PlannedLongitude": -96.864586
    },
    {
      "PlannedLatitude": 32.7498,
      "PlannedLongitude": -96.8720
    },
    {
      "PlannedLatitude": 32.7905,
      "PlannedLongitude": -96.8104
    },
    {
      "PlannedLatitude": 32.8481,
      "PlannedLongitude": -96.8512
    },
    {
      "PlannedLatitude": 32.811211,
      "PlannedLongitude": -97.057602
    },
    {
      "PlannedLatitude": 32.897480,
      "PlannedLongitude": -97.040443
    },
    {
      "PlannedLatitude": 32.7605,
      "PlannedLongitude": -97.0037
    }
  ];
  tripStartDate: any;

  marker: any = [];
  // selectedDate = this.service.formatDate(this.tripFilterOption.tripDate);
  userId = localStorage.getItem('userId');

  // variables for drawing route
  directionsDisplay;
  directionsService;

  directionsDisplay2;
  directionsService2;
  request = {};

  constructor(
    private _elementRef: ElementRef,
    private service: TrackerService,
  ) {
  }

  ngOnInit() {
    const now = new Date();
    this.tripFilterOption['tripDate'] = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

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
            this.tripFilterOption.TripID = this.trips[0].TripID;
            this.fetchTicketDetailsByTrip(this.tripFilterOption.TripID);
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
  fetchTicketDetailsByTrip(tripID) {
    for (var i = 0; i < this.trips.length; i++) {
      if (parseInt(tripID) === this.trips[i].TripID) {
        this.selectedTrip = this.trips[i].TripTicketList;
        this.tripStartDate = this.trips[i].TripStartDate
      }
    }
    console.log('this.selectedTrip', this.selectedTrip);
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
    console.log('tripId', this.tripFilterOption.TripID);
    this.fetchTicketDetailsByTrip(this.tripFilterOption.TripID);
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
      var map = new google.maps.Map(el, {
        center: new google.maps.LatLng(32.736259, -96.864586),
        zoom: 9,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });
      var infowindow = new google.maps.InfoWindow();
      var bounds = new google.maps.LatLngBounds();
      var pinColor;
      var pinImage;

      // If Planned Sequence Radio button is selected
      if (this.planned) {
        for (var i=0; i < this.selectedTrip.length; i++) {

          // changing color of the marker icon based on condition
          if (this.selectedTrip[i].TicketNumber) {
            pinColor = 'A52A2A';    // brown color for Planned service
          } else {
            pinColor = '0000ff';    // blue color for Unplanned service
          }
          // TODO: set color for Skipped stops and Did Not Service

          // customising the marker icon here
          pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
          new google.maps.Size(21, 34),
          new google.maps.Point(0,0),
          new google.maps.Point(10, 34));

          // start point of straight line
          var startPt = new google.maps.LatLng(this.selectedTrip[i].PlannedLatitude,this.selectedTrip[i].PlannedLongitude);
          
          // adding check here to avoid 'undefined' condition
          if (this.selectedTrip[i+1]) {
            // end point fo straight line
            var endPt = new google.maps.LatLng(this.selectedTrip[i+1].PlannedLatitude,this.selectedTrip[i+1].PlannedLongitude);
          }
          
          // this will draw straight line between multiple points
          var polyline = new google.maps.Polyline({
              path: [startPt, endPt],
              strokeColor: 'brown',
              strokeWeight: 2,
              strokeOpacity: 1
          });
    
          polyline.setMap(map);
          bounds.extend(startPt);
          bounds.extend(endPt);
          
          // adding pushpin marker logic here
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.selectedTrip[i].PlannedLatitude, this.selectedTrip[i].PlannedLongitude),
            map: map,
            icon: pinImage
          });
          
          // snippet for showing info window on marker click
          google.maps.event.addListener(marker, 'click', ((marker, i)=> {
            return ()=> {
              infowindow.setContent('Customer Name : ' + this.selectedTrip[i].CustomerName + '<br>' + 
              'Total Sale : ' + this.selectedTrip[i].TotalSale + '<br>' +
              'Total Amount : ' + this.selectedTrip[i].TotalAmount);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
        map.fitBounds(bounds);
      } else if (this.actual) {
        for (var i=0; i < this.selectedTrip.length; i++) {
          
          // changing color of the marker icon based on condition
          if (this.selectedTrip[i].TicketNumber) {
            pinColor = 'A52A2A';    // brown color for Planned service
          } else {
            pinColor = '0000ff';    // blue color for Unplanned service
          }
          // TODO: set color for Skipped stos and Did Not Service

          // customising the marker icon here
          pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
          new google.maps.Size(21, 34),
          new google.maps.Point(0,0),
          new google.maps.Point(10, 34));

          // start point of straight line
          if (this.selectedTrip[i])
          var startPt = new google.maps.LatLng(this.selectedTrip[i].ActualLatitude,this.selectedTrip[i].ActualLongitude);
          
          // adding check here to avoid 'undefined' condition
          if (this.selectedTrip[i+1]) {
            // end point fo straight line
            var endPt = new google.maps.LatLng(this.selectedTrip[i+1].ActualLatitude,this.selectedTrip[i+1].ActualLongitude);
          }
          
          // this will draw straight line between multiple points
          var polyline = new google.maps.Polyline({
              path: [startPt, endPt],
              strokeColor: 'brown',
              strokeWeight: 2,
              strokeOpacity: 1
          });
    
          polyline.setMap(map);
          bounds.extend(startPt);
          bounds.extend(endPt);
          
          // adding pushpin marker logic here
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.selectedTrip[i].ActualLatitude, this.selectedTrip[i].ActualLongitude),
            map: map,
            icon: pinImage
          });
          
          // snippet for showing info window on marker click
          google.maps.event.addListener(marker, 'click', ((marker, i)=> {
            return ()=> {
              infowindow.setContent('Customer Name : ' + this.selectedTrip[i].CustomerName + '<br>' + 
              'Total Sale : ' + this.selectedTrip[i].TotalSale + '<br>' +
              'Total Amount : ' + this.selectedTrip[i].TotalAmount);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
        map.fitBounds(bounds);
      } else {
        for (var i=0; i < this.selectedTrip.length; i++) {
          
          // changing color of the marker icon based on condition
          if (this.selectedTrip[i].TicketNumber) {
            pinColor = 'A52A2A';    // brown color for Planned service
          } else {
            pinColor = '0000ff';    // blue color for Unplanned service
          }
          // TODO: set color for Skipped stops and Did Not Service

          // customising the marker icon here
          pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
          new google.maps.Size(21, 34),
          new google.maps.Point(0,0),
          new google.maps.Point(10, 34));

          // start point of straight line
          var startPt = new google.maps.LatLng(this.selectedTrip[i].PlannedLatitude,this.selectedTrip[i].PlannedLongitude);
          
          // adding check here to avoid 'undefined' condition
          if (this.selectedTrip[i+1]) {
            // end point fo straight line
            var endPt = new google.maps.LatLng(this.selectedTrip[i+1].PlannedLatitude,this.selectedTrip[i+1].PlannedLongitude);
          }
          
          // this will draw straight line between multiple points
          var polyline = new google.maps.Polyline({
              path: [startPt, endPt],
              strokeColor: 'brown',
              strokeWeight: 2,
              strokeOpacity: 1
          });
    
          polyline.setMap(map);
          bounds.extend(startPt);
          bounds.extend(endPt);
          
          // adding pushpin marker logic here
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.selectedTrip[i].PlannedLatitude, this.selectedTrip[i].PlannedLongitude),
            map: map,
            icon: pinImage
          });
          
          // snippet for showing info window on marker click
          google.maps.event.addListener(marker, 'click', ((marker, i)=> {
            return ()=> {
              infowindow.setContent('Customer Name : ' + this.selectedTrip[i].CustomerName + '<br>' + 
              'Total Sale : ' + this.selectedTrip[i].TotalSale + '<br>' +
              'Total Amount : ' + this.selectedTrip[i].TotalAmount);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
        map.fitBounds(bounds);
      }
    });
  }
}
