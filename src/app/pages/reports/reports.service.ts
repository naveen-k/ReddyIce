import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { UserService } from '../../shared/user.service';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
@Injectable()
export class ReportService extends SharedService {

    constructor(
        protected http: HttpService,
        private userService: UserService,
    ) {
        super(http);
    }
    getDistributors() {
        return this.http.get(`api/Distributor`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }
    getBranches() {
        return this.http.get(`api/branch`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }
    getDriversbyBranch(branchId) {
        return this.http.get(`api/user?driverlistbybranch=${branchId}&IsInternal=${true}`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }
    getDriversbyDistributors(distID) {
        return this.http.get(`api/report/driverbydistributorid?id=${distID}`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }

    getCustomersByBranchandDist(rType, branchId, distributorId) {
        if (rType == 'internal' && branchId === 1) {
            return Observable.from([[]])
        } else if (rType == 'external' && distributorId == 0) {
            return Observable.from([[]])
        }
        let url = `api/user/getcustomerbybranchidordistributorid`;
        if (rType == 'internal') {
            url = `${url}?branchId=${branchId}`;
        } else if (rType == 'external') {
            url = `${url}?distributorId=${distributorId}`;
        }
        return this.http.get(url)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }

    getCustomerSearch(searchString: string): Observable<any[]> {
        return this.http.get(`api/user/getcustomerbybranchidordistributorid?branchId=1&serachstring=${searchString}`).map(res => res.json().slice(0,10));
    }
}
