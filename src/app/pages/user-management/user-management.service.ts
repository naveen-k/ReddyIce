import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
import { User } from './user-management.interface';

@Injectable()
export class UserManagementService {
    constructor(private http: HttpService, private tempHttp: Http) { }

    getUsers(): Observable<User[]> {
        return this.http.get('api/user/GetUsersList').map((res) => res.json());
    }

    createUser(data): Observable<Response> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ 'headers': headers });
        return this.http.post('api/user/CreateUser', data, options).map((res => res.json()));
    }

    getRoles(): Observable<any> {
        // change `tempHttp` to `http` once actual api is ready
        return this.http.get('api/user/GetUserRoles').map((res) => res.json());
    }

    getDistributerAndCopacker(): Observable<any> {
        // change `tempHttp` to `http` once actual api is ready
        return this.tempHttp.get('https://private-e13c7-reddyice.apiary-mock.com/getDisco').map((res) => res.json());
    }

    getBranches(): Observable<any> {
        // change `tempHttp` to `http` once actual api is ready
        return this.http.get('api/user/GetUserBranches').map((res) => res.json());
    }
}
