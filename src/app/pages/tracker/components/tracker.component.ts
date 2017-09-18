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
  allTracks: any = {};
  allTrips: any = {};
  showSpinner: boolean = false;
  trips: any = [];
  selectedDate: any = '2017-08-27';
  tripFilterOption: any = {
    uId: "0",
    tripDate: this.selectedDate,
    branchId: '1', isForAll: true
  };
  userId = localStorage.getItem('userId');

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
    this.allTracks = [
      {
        'planned': 1,
        'actual': 2,
        'dateTime': '2017-09-10',
        'customer': 'ABC',
      },
    ];
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

  loadTrips() {
    this.service.getTrips(this.userId, this.selectedDate,
      this.tripFilterOption.branchId, this.tripFilterOption.isForAll).subscribe((res) => {
        if (typeof res == 'object') {
            this.trips = res.Trips;
        }
        else {
            this.trips = [];
        }

    }, (error) => {
        console.log(error);
        this.trips = [];
    });
  }

  ngAfterViewInit() {
    let el = this._elementRef.nativeElement.querySelector('.google-maps');
    // TODO: do not load this each time as we already have the library after first attempt
    GoogleMapsLoader.load((google) => {
      var map = new google.maps.Map(el, {
        center: new google.maps.LatLng(32.7767, -96.7970),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });
      var marker1 = new google.maps.Marker({
        position: new google.maps.LatLng(32.7767, -96.7970),
        map: map
      });
      var marker2 = new google.maps.Marker({
        position: new google.maps.LatLng(32.8767, -96.8970),
        map: map
      });
      // var transitLayer = new google.maps.TransitLayer();
      // transitLayer.setMap(map);
      ////////////////  
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.directionsDisplay.setMap(map);
      this.directionsService = new google.maps.DirectionsService();
      var start = new google.maps.LatLng(32.7767, -96.7970);
      var end = new google.maps.LatLng(32.8767, -96.8970);
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(start);
      bounds.extend(end);
      map.fitBounds(bounds);
      this.request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };
      let mapObject = this;
      new google.maps.DirectionsService().route(this.request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          mapObject.directionsDisplay.setDirections(response);
          mapObject.directionsDisplay.setMap(map);
        } else {
          alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        }
      });

      ////////////////
    });
    this.calcRoute();
  }

  // trying to draw route
  directionsDisplay;
  directionsService;
  request = {};

  calcRoute() {
    GoogleMapsLoader.load((google) => {
      // this.directionsService = new google.maps.DirectionsService();
      // var start = new google.maps.LatLng(32.7767, -96.7970);
      // var end = new google.maps.LatLng(32.8767, -96.8970);
      // var bounds = new google.maps.LatLngBounds();
      // bounds.extend(start);
      // bounds.extend(end);
      // this.mapDraw.fitBounds(bounds);
      // this.request = {
      //   origin: start,
      //   destination: end,
      //   travelMode: google.maps.TravelMode.DRIVING
      // };
      // this.directionsService.route(this.request, function (response, status) {
      //   if (status == google.maps.DirectionsStatus.OK) {
      //       this.directionsDisplay.setDirections(response);
      //       this.directionsDisplay.setMap(this.mapDraw);
      //   } else {
      //       alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
      //   }
      // });
    });
  }
}
