import { Injectable } from "@angular/core";
import { HttpService } from "app/shared/http.service";

@Injectable()
export class CustomerMaintenanceService {
    
    constructor(private http: HttpService) { }

    getRequestType() {
        return this.http.get(`api/CustomerMaintenance/GetAllChangeRequestStatus`)
        .map((res) => res.json());
    }

    getStatus() {
        return this.http.get(`api/CustomerMaintenance/GetAllChangeRequestStatus`)
        .map((res) => res.json());
    }

    getAllRequests() {
        return this.http.get(`api/CustomerMaintenance/GetAllRequests`)
        .map((res) => res.json());
    }

    getChangeRequests(id: string) {
        return this.http.get(`api/CustomerMaintenance/GetChangeRequestFields`, { 
            params: { id }
         })
        .map((res) => res.json());
    }

}
