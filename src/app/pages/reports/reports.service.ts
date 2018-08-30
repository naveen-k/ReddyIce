import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { UserService } from '../../shared/user.service';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'app/shared/cache.service';
@Injectable()
export class ReportService extends SharedService {
    private _distributor;
    constructor(
        protected http: HttpService,
        private userService: UserService,
        protected cache: CacheService
    ) {
        super(http, cache);
    }
	getreportoptions(lookUpDefId: number):  Observable<any> {
        const url = `api/Lookup?lookUpDefId=${lookUpDefId}`;
       return this.http.get(url).map((res) =>  
        res.json()
       );
	}
	
	getDriverByBranchList(TripDate, branchId,ISRI, endDate) {
   let url = `api/trip/GetTripforTracker?TripStartDate=${TripDate}&branchId=${branchId}&ISRI=${ISRI}&EndDate=${endDate}`;
    return this.http.get(url)
      .map((res) => res.json()).map((res) => {
        return res.AllTrip;
      });
  }
	getTripsForManifestReport(TripDate, branchId,ISRI) {
	   let url = `api/trip/GetTripforTracker?TripStartDate=${TripDate}&branchId=${branchId}&ISRI=${ISRI}`;
		return this.http.get(url)
		  .map((res) => res.json()).map((res) => {
			return res;
		  });
   }
   /*getSTechByBranch(branchId,startDate,endDate) {
        return this.http.get(`api/report/getlistoftripservicetechnician?BranchId=${branchId}&TripStartDate=${startDate}&TripEndDate=${endDate}`)
        .map((res) => res.json()).map((res) => {
            return res;
        });
    }*/
	getSTechByBranch(branchId,startDate,endDate) {
   let url = `api/trip/allFES?tripDate=${startDate}&branchId=${branchId}&EndDate=${endDate}`;
    return this.http.get(url)
      .map((res) => res.json()).map((res) => {
        return res.FESTechRoute;
      });
  }
    getAssets(branchId,startDate,endDate) {
        //http://frozen.reddyice.com/FESEnhancement/api/report/getassetlist?BranchID={BranchID}&StartDate={StartDate}&EndDate={EndDate}&ReportType={ReportType
        return this.http.get(`api/report/getassetlist?BranchID=${branchId}&StartDate=${startDate}&EndDate=${endDate}&ReportType=null`)
        .map((res) => res.json()).map((res) => {
            return res;
        });
    }

    getlistofcustomerfes(branchId,startDate,endDate) {
        return this.http.get(`api/report/getlistofcustomerfes?BranchId=${branchId}&TripStartDate=${startDate}&TripEndDate=${endDate}`)
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

    getCustomerDropDownList(IsRI,distributorId){
		 if (this.cache.has("reportCustomers")) { return this.cache.get("reportCustomers"); }
		 let url:string = '';
		  url = `api/report/customerswithfilters?IsRI=${IsRI}`;
		 if(distributorId){
			 url = `api/report/customerswithfilters?IsRI=${IsRI}&DistributorId=${distributorId}`;
		 }
        return this.http.get(url)
        .map((res)=>res.json()).map((res)=>{
			
			if(distributorId){
				this.cache.set("reportCustomers", (res.DistCustomer));
             return res.DistCustomer;
			}
			 this.cache.set("reportCustomers", (res.RICustomer));
            return res.RICustomer;
			
        });
    }
    loadExternalReports(url){
        return this.http.get(url)
        .map((res) => {
            return res;
        });
    }
	 /* getDistributors() {
        if(this._distributor){return Observable.of(this._distributor);}
        return this.http.get(`api/report/Distributor`)
            .map((res) => res.json()).map((res) => {
                this._distributor = res;
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
	*/
}
