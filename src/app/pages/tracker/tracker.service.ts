import { Customer } from '../../shared/interfaces/interfaces';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { SharedService } from '../../shared/shared.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class TrackerService extends SharedService {

  constructor(protected http: HttpService) {
    super(http);
  }
  
  getTrips(userId, TripDate, branchId, IsForAll) {
    return this.http.get(`api/trip/allfortracker?TripDate=${TripDate}&branchId=${branchId}&userId=${userId}&IsForAll=${IsForAll}`)
    .map((res) => res.json()).map((res) => {
        return res;
    });
  }

  getDistributors(userId, selectedDate) {
    return this.http.get(`api/trip/listofdistributorfordate?Id=${userId}&Date=${selectedDate}`)
    .map((res) => res.json()).map((res) => {
        return res;
    });
  }

  getBranchesByDate(userId, selectedDate) {
    return this.http.get(`api/trip/listofbranchesfordate?Id=${userId}&Date=${selectedDate}`)
    .map((res) => res.json()).map((res) => {
        return res;
    });
  }
}
