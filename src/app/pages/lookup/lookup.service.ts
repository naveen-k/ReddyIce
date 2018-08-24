import { SharedService } from '../../shared/shared.service';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'app/shared/cache.service';

@Injectable()
export class LookupService extends SharedService {
    constructor(
        protected http: HttpService,
		protected cache: CacheService
    ) {
        super(http, cache);
    }

    getlookuptypes():  Observable<any> {
        const url = "api/LookupDef";
       return this.http.get(url).map((res) => 
       res.json()
       );
    }
    updatelookupItem(data, id): Observable<any> {
			console.log(data);
        return this.http.put(`api/LookUp?id=${id}`, data).map((res => res.json())).map((res)=>{
           return res;
        });
    
    }
	createlookupItem(data): Observable<any> {
	
        return this.http.post(`api/LookUp`, data).map((res => res.json())).map((res)=>{
			
           return res;
        });
    
    }
	
    getlookuptypedetail(lookUpDefId: number):  Observable<any> {
        const url = `api/Lookup?lookUpDefId=${lookUpDefId}`;
       return this.http.get(url).map((res) =>  
        res.json()
		//console.log(res);
       );
    }
}
