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

  constructor(private _elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    let el = this._elementRef.nativeElement.querySelector('.google-maps');    
    // TODO: do not load this each time as we already have the library after first attempt
    GoogleMapsLoader.load((google) => {
      new google.maps.Map(el, {
        center: new google.maps.LatLng(44.5403, -78.5463),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    });
  }

}
