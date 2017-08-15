import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
import { User } from './user-management.interface';

@Injectable()
export class UserManagementService {
    constructor(private http: HttpService, private tempHttp: Http) { }

    getUsers(id?: number): Observable<User[]> {
        const url = id ? `api/user?DistributorCopackerID=${id}` : 'api/user';
        return this.http.get(url).map((res) => res.json());
    }

    createUser(data): Observable<Response> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ 'headers': headers });
        return this.http.post('api/user', data, options).map((res => res.json()));
    }

    updateUser(data, id): Observable<Response> {
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

    getBranches(): Observable<any> {
        // change `tempHttp` to `http` once actual api is ready
        return this.http.get('api/branch').map((res) => res.json());
    }
}
