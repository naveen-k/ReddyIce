import { Customer } from '../../shared/interfaces/interfaces';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { SharedService } from '../../shared/shared.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { CacheService } from 'app/shared/cache.service';

@Injectable()
export class TrackerService extends SharedService {

  constructor(protected http: HttpService, protected cache: CacheService) {
    super(http, cache);
  }
getTripsForFesTracker(TripDate, branchId) {
   let url = `api/trip/allFES?tripDate=${TripDate}&branchId=${branchId}`;
    return this.http.get(url)
      .map((res) => res.json()).map((res) => {
        return res;
      });
  }
   getTripsForTracker(TripDate, branchId,ISRI) {
   let url = `api/trip/GetTripforTracker?TripStartDate=${TripDate}&branchId=${branchId}&ISRI=${ISRI}`;
    return this.http.get(url)
      .map((res) => res.json()).map((res) => {
        return res;
      });
  }
  getTrips(TripDate, open) {
    let url = `api/trip/all?TripDate=${TripDate}`;
    if (open) {
      url = `api/trip/openallfortracker?TripDate=${TripDate}`;
    }
    return this.http.get(url)
      .map((res) => res.json()).map((res) => {
        return res;
      });
  }
   
  getTripsFES(TripDate, open) {
    let url = `api/trip/allFES?TripDate=${TripDate}`;
    if (open) {
      url = `api/trip/openallfortracker?TripDate=${TripDate}`;
    }
    return this.http.get(url)
      .map((res) => res.json()).map((res) => {
        return res;
      });
  }

  getTripTicketsByTripID(tripId){
    return this.http.get(`api/trip/allfortracker?TripID=${tripId}`).map(res=> res.json());
  }

  getTripTicketsByTripIDFES(tripId){
    return this.http.get(`api/trip/allfortrackerFES?TripID=${tripId}`).map(res=> res.json());
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
