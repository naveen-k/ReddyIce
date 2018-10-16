import { environment } from '../../../environments/environment';
import { UserService } from '../../shared/user.service';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import {CacheService} from '../../shared/cache.service';

@Injectable()
export class LoginService {
    
   API_ENDPOINT = environment.apiEndpoint;
   
    constructor(private http: Http, private userService: UserService,private cacheService:CacheService) {}
    userInfo: any;
    login(data: any): Observable<any> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
		const options = new RequestOptions({ 'headers': headers });
        return this.http.post(`${this.API_ENDPOINT}api/token`, data, options).map((res) => res.json()).map((res) => {
			//console.log(data);
            this.userInfo = res;
            localStorage.setItem('auth_token', res.access_token);
            localStorage.setItem('userId', res.UserID);
            localStorage.setItem('user_token', JSON.stringify(res));
            // clear private keys
            this.userService.setPrivateKeys(null);
            if (res.PrivateKey1 && res.PrivateKey2) {
                this.userService.setPrivateKeys({ 'PrivateKey1': res.PrivateKey1, 'PrivateKey2': res.PrivateKey2 });
            }
			
            return res;
        });
    }

    signOut() {
        this.cacheService.deleteCache();
		//let userid = localStorage.getItem('userId');
		localStorage.setItem('userId','');
        localStorage.setItem('auth_token', '');
        localStorage.setItem('user_token', '');
		localStorage.setItem('email', '');
        localStorage.setItem('password', '');
    }
	autoLogin(data:any): Observable<any> {
		return this.http.get(`${this.API_ENDPOINT}api/AutoLogin?UserID=${data.UserID}&isAutoLogin=${data.isAutoLogin}`).map((res => 
			res.json()
			));
	}

}
