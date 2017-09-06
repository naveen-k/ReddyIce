import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';


@Injectable()
export class SharedService {
    protected http: HttpService;

    private _branches: any;
    constructor(http: HttpService) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }

    getBranches(userId): Observable<any> {
        // if (this._branches) { return Observable.of(this._branches); }
        return this.http.get(`api/DistributorBranches?Id=${userId}`).map((res) => res.json()).map((res) => {
            // Cache branch response
            this._branches = res;
            return res;
        });
    }

    getDriverByBranch(branchId): Observable<any[]> {
        return this.http.get(`api/user?driverlistbybranch=${branchId}`).map(res => res.json());
    }

    uploadFile(file): Observable<any> {
        return this.http.post(`api/manualticket/uploadImage`, file).map(res => res.json());
    }

    updateFile(file): Observable<any> {
        return this.http.put(`api/manualticket/updateImage?ImageID=${file.ImageID}`, file).map(res => res.json());
    }

    formatDate(date) {
        if (!date.year) { return '' };
        let yy = date.year, mm = date.month, dd = date.day;
        if (mm < 10) { mm = '0' + mm }
        if (dd < 10) { dd = '0' + dd }
        return yy + '-' + mm + '-' + dd;

    }
}
