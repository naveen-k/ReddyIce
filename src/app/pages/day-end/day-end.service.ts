import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { UserService } from '../../shared/user.service';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
// import { User } from '../user-management.interface';

@Injectable()
export class DayEndService extends SharedService {
    currenttripData: any = {};
    constructor(
        protected http: HttpService,
        private userService: UserService,
    ) {
        super(http);
    }
    getTrips(userId, TripDate, branchId, IsForAll) {

        return this.http.get(`api/trip/all?TripDate=${TripDate}&branchId=${branchId}&userId=${userId}&IsForAll=${IsForAll}`)
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
        // return this.http.get(`api/trip/ticketsbytripanddate?TripId=${tripId}&TripStartDate=${startDate}`).map((res) => res.json()).map((res) => {
        //     return res;
        // });
        return this.http.get(`api/trip/ticketsbytripanddate?TripId=${tripId}`).map((res) => res.json()).map((res) => {
            return res;
        });
    }
    getTripsByDate(date?: any): Observable<any[]> {
        return this.http.get(`api/trip?date=${date}`).map((res) => res.json()).map((res) => {
            console.log(res);
            return res;
        });
    }

    getUnitsReconciliation(tripID): Observable<any[]> {
        return this.http.get(`api/trip/unitsreconciliation?tripID=${tripID}`).map((res) => res.json()).map((res) => {
            console.log(res);
            return res;
        });
    }
    submitTickets(data) {
        return this.http.post('api/manualticket/workflow', data).map((res => res.json()));
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


}
