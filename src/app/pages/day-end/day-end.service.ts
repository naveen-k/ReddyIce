import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { UserService } from '../../shared/user.service';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'app/shared/cache.service';
// import { User } from '../user-management.interface';

@Injectable()
export class DayEndService extends SharedService {
    currenttripData: any = {};
    private _filter: any = {
        type: 'internal',
        userBranch: 1
    };

    constructor(
        protected http: HttpService,
        private userService: UserService,
        protected cache: CacheService
    ) {
        super(http, cache);
    }
    getTrips(TripDate) {
        return this.http.get(`api/trip/all?TripDate=${TripDate}`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }
    getTripDetails(tripId) {
        return this.http.get(`api/trip/ticketsfortrip?TripId=${tripId}`).map((res) => res.json()).map((res) => {
            return res;
        });

    }
    getTripDetailByDate(tripId, startDate?) {
        return this.http.get(`api/trip/ticketsbytripanddate?TripId=${tripId}`).map((res) => res.json()).map((res) => {
            return res;
        });
    }
    getTripsByDate(date?: any): Observable<any[]> {
        return this.http.get(`api/trip?date=${date}`).map((res) => res.json()).map((res) => {
            return res;
        });
    }

    getUnitsReconciliation(tripID): Observable<any[]> {
        return this.http.get(`api/trip/unitsreconciliation?tripID=${tripID}`).map((res) => res.json()).map((res) => {
            return res;
        });
    }

    submitTickets(data) {
        return this.http.put('api/manualticket/workflow', data).map((res => res.json()));
    }

    saveRecociliation(data): Observable<any> {

        return this.http.put('api/trip/cashreconciliation', data).map((res => res.json()));
    }

    saveUnitReconciliation(data): Observable<any> {
        return this.http.put('api/trip/unitsreconciliation', data).map((res => res.json()));
    }
    // used for data flow between components
    setTripData(data) {
        this.currenttripData = data;
    }

    getTripData() {
        return this.currenttripData;
    }

    getProductList(): Observable<any[]> {
        return this.http.get(`api/product`).map((res) => res.json()).map((res) => {
            return res;
        });
    }

    getFilter() {
        return this._filter;
    }

}
