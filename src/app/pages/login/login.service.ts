import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
    API_ENDPOINT = 'http://frozen.reddyice.com/DPServices/';
    constructor(private http: Http) {}

    login(data: any): Observable<any> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ 'headers': headers });        
        return this.http.post(`${this.API_ENDPOINT}api/token`, data , options ).map((res) => res.json());
    }
   
}
