import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { UserDetails } from './user.interface';
import { HttpService } from './http.service';
@Injectable()
export class UserService {
    userDetails: UserDetails;

    constructor(private http: HttpService) { }
    privateKeys: any;


    getUser(): any {
        if (!localStorage.getItem('user')) { return {}; }
        return JSON.parse(localStorage.getItem('user'));
    }

    setUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUserDetails(id: string): Observable<UserDetails> {
        // if (this.userDetails) { return Observable.of(this.userDetails); }
       // http://frozen.reddyice.com/myiceboxservice_dev/api/users?id=1
        return this.http.get(`api/user?UserId=${id}`).map((res) => res.json()).map((user) => {
            this.setUser(user);
            this.userDetails = user;
            return user;
        });
    }
    isUserExist(email) {
        return this.http.get(`api/user/IsUserExist?email=${email}`).map((res) => {
            return res.json();
        });
    }
    setPrivateKeys(values) {
        // this.privateKeys = values;        
        values = values || '';
        localStorage.setItem('privateKeys', JSON.stringify(values));
    }

    getPrivateKeys(): any {
        return JSON.parse(localStorage.getItem('privateKeys'));
    }

    getUserForAutoLogin() {
        let user = localStorage.getItem('auto_login_user');
        if (user) {
            user = JSON.parse(user);
        }
        return user;
    }
}
