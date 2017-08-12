import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Http, RequestOptions, Response, XHRBackend, RequestOptionsArgs, Headers, Request } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpService extends Http {
    API_ENDPOINT = 'http://frozen.reddyice.com/DPServices/';
    constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router) {
        super(backend, defaultOptions);
        // const token = localStorage.getItem('auth_token'); // your custom token getter function here
        // defaultOptions.headers.set('Authorization', `bearer ${token}`);

    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        const token = localStorage.getItem('auth_token');
        if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
            if (!options) {
                // let's make option object
                options = { headers: new Headers() };
            }
            options.headers.set('Authorization', `Bearer ${token}`);
            url = `${this.API_ENDPOINT}${url['url']}`;
        } else {
            // we have to add the token to the url object
            url.headers.set('Authorization', `Bearer ${token}`);
            url['url'] = `${this.API_ENDPOINT}${url['url']}`;
        }
        return super.request(url, options).catch(this.catchAuthError(this));
    }

    private catchAuthError(self: HttpService) {
        // we have to pass HttpService's own instance here as `self`
        return (res: Response) => {
            console.log(res);
            if (res.status === 401 || res.status === 403) {
                // if not authenticated
                console.log(res);
                this.router.navigate(['login']);
            }
            return Observable.throw(res);
        };
    }
}
