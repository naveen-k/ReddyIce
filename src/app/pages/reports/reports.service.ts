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
        return this.http.get(`api/reportbranch`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }
    getCustomerBranches() {
        return this.http.get(`api/reportcustomerbranch`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }
    getDriversbyBranch(branchId,userId,startDate,endDate,distributorID) {
        //return this.http.get(`api/user?driverlistbybranch=${branchId}&IsInternal=${true}`)
        return this.http.get(`api/report/getlistoftripdriver?BranchId=${branchId}&UserId=${userId}&TripStartDate=${startDate}&TripEndDate=${endDate}&DistributorId=${distributorID}`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }
    getSTechByBranch(branchId,startDate,endDate) {
        return this.http.get(`api/report/getlistoftripservicetechnician?BranchId=${branchId}&TripStartDate=${startDate}&TripEndDate=${endDate}`)
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
        } else if (rType == 'external' && distributorId === 0) {
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

    getCustomerSearch(
        searchString: string,
        userType: string,
        branchId?: number,
        distributorId?: number,
        customerSourceId?: number,
    ): Observable<any[]> {

        let url = `api/user/getcustomerbybranchidordistributorid?serachstring=${searchString}`;
        if (userType === 'internal') {
            url = `${url}&branchId=${branchId}`;
        } else {
            url = `${url}&distributorId=${distributorId || 1}&customerSourceId=${customerSourceId || 1}`;
        }
        return this.http.get(url).map(res => res.json().slice(0, 10));
    }

    getCustomersonTicketReport(TicketNumber) {
        return this.http.get(`api/report/customerticketdetails?TicketNumber=${TicketNumber}`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }

    checkworkorderexistence(workOrderNumber) {
        return this.http.get(`api/checkworkorderexistence?WorkOrderNo=${workOrderNumber}`)
        .map((res) => res.json()).map((res) => {
            return res;
        });
    }

    getManifestRoutes(branchId,deliveryDate) {
        return this.http.get(`api/report/getroutes?BranchId=${branchId}&DeliveryDate=${deliveryDate}`)
        .map((res) => res.json()).map((res) => {
            return res;
        });
    }
    
    getRoutesForRange(branchId, DeliveryStartDate, DeliveryEndDate) {
        return this.http.get(`api/report/getroutesfordaterange?BranchId=${branchId}&DeliveryStartDate=${DeliveryStartDate}&DeliveryEndDate=${DeliveryEndDate}`)
        .map((res) => res.json()).map((res) => {
            return res;
        });
    }

    getCustomerDropDownList(branch,userID,startDate,endDate,distributor){
        return this.http.get(`api/report/customerswithfilters?BranchId=${branch}&UserId=${userID}&TripStartDate=${startDate}&TripEndDate=${endDate}&DistributorId=${distributor}`)
        .map((res)=>res.json()).map((res)=>{
            return res;
        })
    }
}
