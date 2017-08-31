import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';


@Injectable()
export class SharedService {
    protected http: HttpService;

    private _branches: any;
    constructor(http: HttpService) { }

    getBranches(userId): Observable<any> {
        // if (this._branches) { return Observable.of(this._branches); }
        return this.http.get(`api/DistributorBranches?Id=${userId}`).map((res) => res.json()).map((res) => {
            // Cache branch response
            this._branches = res;
            return res;
        });
    }
    formatDate(date) {
        if(!date.year){return false};
        let yy = date.year, mm = date.month, dd = date.day;
        if (mm < 10) { mm = '0' + mm }
        if (dd < 10) { dd = '0' + dd }
        return yy + '-' + mm + '-' + dd;

    }
}
