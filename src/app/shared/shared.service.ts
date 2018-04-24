import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';

@Injectable()
export class SharedService {
    protected http: HttpService;

    constructor(http: HttpService, private cacheService: CacheService) { }

}
