
import { Injectable } from '@angular/core';
@Injectable()
export class UserService {
    constructor() { }

    getUser(): any {
        if (!localStorage.getItem('user')) { return {}; }
        return JSON.parse(localStorage.getItem('user'));
    }

    setUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    }
}
