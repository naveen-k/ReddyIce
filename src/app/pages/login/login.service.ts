import { UserService } from '../../shared/user.service';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
    API_ENDPOINT = 'http://frozen.reddyice.com/DPServicesnew/';
    constructor(private http: Http, private userService: UserService) { }

    login(data: any): Observable<any> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ 'headers': headers });
        return this.http.post(`${this.API_ENDPOINT}api/token`, data, options).map((res) => res.json()).map((res) => {
            localStorage.setItem('auth_token', res.access_token);            
            this.userService.setUser(res);
            return res;
        });
    }

    signOut() {
        localStorage.setItem('auth_token', '');
    }

}
