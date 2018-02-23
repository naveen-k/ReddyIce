import { SharedService } from '../../shared/shared.service';
import { UserService } from '../../shared/user.service';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
import { User } from './user-management.interface';
import { CacheService } from 'app/shared/cache.service';

@Injectable()
export class UserManagementService extends SharedService {
    private _users: any = {};
    private _loggedInUser: number =0;
    constructor(
        protected http: HttpService,
        private userService: UserService,
        protected cache: CacheService
    ) {
        super(http, cache);
    }


    getUsers(id?: number, branchid?: number): Observable<any> {
        // if (id && this._users[id]) { return Observable.of(this._users[id]); }
        this._loggedInUser = id;
        const url = `api/users?id=${id}`;
        if(this.cache.has("user-management-users"+id)){ 
            this._users[id] = this.cache.get("user-management-users"+id);
            return this.cache.get("user-management-users"+id);
        }
        return this.http.get(url).map((res) => res.json()).map((res) => {
            this._users[id] = res;
            this.cache.set("user-management-users"+id,res);
            return res;
        });
    }

    createUser(data): Observable<User> {
        return this.http.post('api/user', data).map((res => res.json())).map((res)=>{
            const userId = this._loggedInUser;
            if(this.cache.has("user-management-users"+userId)){ 
                this.cache.deleteCache("user-management-users"+userId);
            }
            return res;
        });
    }

    updateUser(data, id): Observable<User> {
        return this.http.put(`api/user?id=${id}`, data).map((res => res.json())).map((res)=>{
            const userId = this._loggedInUser;
            if(this.cache.has("user-management-users"+userId)){ 
                this.cache.deleteCache("user-management-users"+userId);
            }
            return res;
        });
    }

    deleteUser(id): Observable<Response> {
        return this.http.put(`api/user/deactivateuser?id=${id}`, {}).map((res => res.json())).map((res)=>{
            const userId = this._loggedInUser;
            if(this.cache.has("user-management-users"+userId)){ 
                this.cache.deleteCache("user-management-users"+userId);
            }
            return res;
        });
    }

    getRoles(): Observable<any> {
        if(this.cache.has("user-management-userroles")){ return this.cache.get("user-management-userroles");}
        return this.http.get('api/roles').map((res) => res.json()).map((res)=>{
            this.cache.get("user-management-userroles",res);
            return res;
        });
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
        if(this.cache.has("user-management-branches")){ return this.cache.get("user-management-branches");}
        return this.http.get('api/branch').map((res) => res.json()).map((res)=>{
            this.cache.set("user-management-branches",res);
            return res;
        });
    }

}
