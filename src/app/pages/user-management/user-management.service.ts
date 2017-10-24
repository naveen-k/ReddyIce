import { SharedService } from '../../shared/shared.service';
import { UserService } from '../../shared/user.service';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
import { User } from './user-management.interface';

@Injectable()
export class UserManagementService extends SharedService {
    private _users: any = {};

    constructor(
        protected http: HttpService,
        private userService: UserService,
    ) {
        super(http);
    }


    getUsers(id?: number): Observable<User[]> {
        // if (id && this._users[id]) { return Observable.of(this._users[id]); }
        const url = `api/users?id=${id}`;
        return this.http.get(url).map((res) => res.json()).map((res) => {
            this._users[id] = res;
            return res;
        });
    }

    createUser(data): Observable<User> {
        return this.http.post('api/user', data).map((res => res.json()));
    }

    updateUser(data, id): Observable<User> {
        return this.http.put(`api/user?id=${id}`, data).map((res => res.json()));
    }

    deleteUser(id): Observable<Response> {
        return this.http.put(`api/user/deactivateuser?id=${id}`, {}).map((res => res.json()));
    }

    getRoles(): Observable<any> {
        return this.http.get('api/roles').map((res) => res.json());
    }

    searchInternalUsers(searchString: string): Observable<any[]> {
        let searchObj = {};
        if (this.userService.getPrivateKeys()) {
            searchObj = this.userService.getPrivateKeys();
        }
        searchObj['SearchString'] = searchString;
        return this.http.post('api/user/searchriuser', searchObj).map((res) => res.json());
    }
    getMultiBranches() {
        return this.http.get('api/branch').map((res) => res.json());
    }

}
