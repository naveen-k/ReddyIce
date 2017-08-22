import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';


@Injectable()
export class SharedService {
    protected http: HttpService;

    private _branches: any;
    constructor(http: HttpService) { }

    getBranches(): Observable<any> {
        if (this._branches) { return this._branches; }
        return this.http.get('api/branch').map((res) => res.json());
    }
}
