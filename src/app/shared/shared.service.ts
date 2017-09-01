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
        const formData: FormData = new FormData();
        formData.append('file', file);

        return this.http.post(`api/manualticket/uploadImage`, formData).map(res => res.json());
        // return Observable.create(observer => {
        //     const formData: FormData = new FormData(),
        //         xhr: XMLHttpRequest = new XMLHttpRequest();

        //     // for (let i = 0; i < files.length; i++) {
        //     //     formData.append("uploads[]", files[i], files[i].name);
        //     // }
        //     formData.append('file', file, file.name);

        //     xhr.onreadystatechange = () => {
        //         if (xhr.readyState === 4) {
        //             if (xhr.status === 200) {
        //                 observer.next(JSON.parse(xhr.response));
        //                 observer.complete();
        //             } else {
        //                 observer.error(xhr.response);
        //             }
        //         }
        //     };

        //     xhr.upload.onprogress = (event) => {
        //         // this.progress = Math.round(event.loaded / event.total * 100);

        //         // this.progressObserver.next(this.progress);
        //     };

        //     xhr.open('POST', `api/manualticket/uploadImage`, true);
        //     xhr.send(formData);
        // });

    }

    formatDate(date) {
        if (!date.year) { return false };
        let yy = date.year, mm = date.month, dd = date.day;
        if (mm < 10) { mm = '0' + mm }
        if (dd < 10) { dd = '0' + dd }
        return yy + '-' + mm + '-' + dd;

    }
}
