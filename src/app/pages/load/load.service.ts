import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { UserService } from '../../shared/user.service';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
// import { User } from '../user-management.interface';

@Injectable()
export class LoadService extends SharedService {
    currentLoadData: any = {};
    private _filter: any = {
        userBranch: 0,
        userDriver:1,
        userBranchName: '',
        userDriverName:'',
        tripCode:0,
        selectedDate: '',
    };

    constructor(
        protected http: HttpService,
        private userService: UserService,
    ) {
        super(http);
    }
    getLoads(LoadDate,BranchId,userId,isForAll) {
       
        return this.http.get(`api/loadreturndamage/allload?tripDate=${LoadDate}`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }
      
    saveLoadDetails(id,data): Observable<any> {

        return this.http.put(`api/loadreturndamage/editload?id=${id}`, data).map((res => res.json()));
    }

    createLoadData(data){
            
        return this.http.post(`api/loadreturndamage/createload`, data).map((res => res.json()));     
    }
    // used for data flow between components
    setLoadData(data) {
        this.currentLoadData = data;
    }

    getLoadData() {
        return this.currentLoadData;
    }

    getProductList(branchId): Observable<any[]> {
        return this.http.get(`api/getbranchxproductsforbranchid?branchId=${branchId}`).map((res) => res.json()).map((res) => {
            return res;
        });
    }

    getFilter() {
        return this._filter;
    }

}
