import { SharedService } from '../../shared/shared.service';
import { UserService } from '../../shared/user.service';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
import { User } from './user-management.interface';

@Injectable()
export class UserManagementService extends SharedService {
    constructor(
        protected http: HttpService,        
        private userService: UserService,
    ) {
        super(http);
     }

    getUsers(id?: number): Observable<User[]> {
        const url = `api/users?id=${id}`;
        return this.http.get(url).map((res) => res.json());
    }

    createUser(data): Observable<User> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ 'headers': headers });
        return this.http.post('api/user', data, options).map((res => res.json()));
    }

    updateUser(data, id): Observable<User> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ 'headers': headers });
        return this.http.put(`api/user?id=${id}`, data, options).map((res => res.json()));
    }

    deleteUser(id): Observable<Response> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ 'headers': headers });
        return this.http.delete(`api/user?id=${id}`).map((res => res.json()));
    }

    getRoles(): Observable<any> {
        // change `tempHttp` to `http` once actual api is ready
        return this.http.get('api/roles').map((res) => res.json());
    }

    getDistributerAndCopacker(): Observable<any> {
        // change `tempHttp` to `http` once actual api is ready
        return this.http.get('api/Distributor').map((res) => res.json());
    }

    searchInternalUsers(searchString: string): Observable<any[]> {
        let searchObj = {};
        if (this.userService.getPrivateKeys()) {
            searchObj = this.userService.getPrivateKeys();
        }
        searchObj['SearchString'] = searchString;
        return this.http.post('api/user/searchriuser', searchObj).map((res) => res.json());
    }
}
