import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { UserDetails } from './user.interface';
import { HttpService } from './http.service';
import * as CryptoJS from 'crypto-js';
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
        values = values || '';
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(values), 'ReddyicePassword');
        localStorage.setItem('privateKeys', ciphertext);
    }

    getPrivateKeys(): any {
		var ciphertext = localStorage.getItem('privateKeys');
	var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'ReddyicePassword');
	return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    getUserForAutoLogin() {
        let user = localStorage.getItem('auto_login_user');
        if (user) {
            user = JSON.parse(user);
        }
        return user;
    }
}
