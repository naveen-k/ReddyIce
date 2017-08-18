import { UserService } from '../../shared/user.service';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
    API_ENDPOINT = 'http://frozen.reddyice.com/DPServicesnew/';
    constructor(private http: Http, private userService: UserService) { }
    userInfo: any;
    login(data: any): Observable<any> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ 'headers': headers });
        return this.http.post(`${this.API_ENDPOINT}api/token`, data, options).map((res) => res.json()).map((res) => {
            this.userInfo = res;
            localStorage.setItem('auth_token', res.access_token);
            localStorage.setItem('userId', res.UserID);
            // clear private keys
            this.userService.setPrivateKeys(null);
            if (res.PrivateKey1 && res.PrivateKey2) {
                this.userService.setPrivateKeys({ 'PrivateKey1': res.PrivateKey1, 'PrivateKey2': res.PrivateKey2 });
            }

            return res;
        }).catch((err) => {
            console.log(err.statusCode);
            return Observable.throw(new Error(err.status));
        });
    }

    signOut() {
        localStorage.setItem('auth_token', '');
        localStorage.setItem('userId', '');
    }

}
