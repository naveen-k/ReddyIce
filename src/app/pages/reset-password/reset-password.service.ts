import { environment } from '../../../environments/environment';
import { UserService } from '../../shared/user.service';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ResetPasswordService {

    API_ENDPOINT = environment.apiEndpoint;
    
    constructor(private http: Http, private userService: UserService) { }

    resetPassword(data: any): Observable<any> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ 'headers': headers });
        return this.http.post(`${this.API_ENDPOINT}api/account/resetpassword`, data, options)
        .map((res) => res.json())
        .catch((err) => {
          console.log(err.status);
          return Observable.throw(new Error(err.status));
        });
    }

}
