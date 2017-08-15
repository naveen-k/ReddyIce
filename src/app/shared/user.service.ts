import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { UserDetails } from './user.interface';
import { HttpService } from './http.service';
@Injectable()
export class UserService {
    API_ENDPOINT = 'http://frozen.reddyice.com/DPServicesnew/';
    constructor(private http: HttpService) { }

    getUser(): any {
        if (!localStorage.getItem('user')) { return {}; }
        return JSON.parse(localStorage.getItem('user'));
    }

    setUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUserDetails(id: string): Observable<UserDetails> {
      return this.http.get(`api/user?UserId=${id}`).map((res) => res.json());
    }
}
