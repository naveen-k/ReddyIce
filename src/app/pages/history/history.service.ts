import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import {CacheService} from '../../shared/cache.service';

@Injectable()
export class HistoryService {
    
   API_ENDPOINT = environment.apiEndpoint;
   
    constructor() { }
    userInfo: any;
}
