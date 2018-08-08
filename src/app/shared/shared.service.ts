import { IOption } from './components/multiple-select/multiple-select';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';


@Injectable()
export class SharedService {
    protected http: HttpService;
	logedInUser: any = {};
	
	

    constructor(http: HttpService, private cacheService: CacheService) { }
	
	
    getBranches(userId): Observable<any> {
		
        if (this.cacheService.has("branches")) { return this.cacheService.get("branches"); }
        return this.http.get(`api/LoggedInUserBranches`).map((res) => res.json()).map((res) => {
			let branchDataSet:any = [];
			 branchDataSet = this.transformOptionsReddySelect(res.Branch, 'BranchID', 'BranchCode', 'BranchName');
			branchDataSet.unshift({"value":0,"label":"Select Business Unit"});
		
            this.cacheService.set("branches", branchDataSet);
            return branchDataSet;
        });
    }

    getAllDriver(): Observable<any> {
		
		if (this.cacheService.has("driverscache")) { 
		
		return this.cacheService.get("driverscache"); }
        return this.http.get(`api/getAllDriver`).map((res) => res.json()).map((res) => {
		
		let driverUser:any[] = res.User;
		let driverDataset:any = [];
		driverDataset = this.transformOptionsdriverSelect(driverUser, 'UserId', 'FirstName', 'LastName');
		driverDataset.unshift({"value":0,"label":"Select Driver","data":{'UserId':0,'FirstName':'Select','LastName':'Driver'}});//,data:{'BranchID':null}
		this.cacheService.set("driverscache", driverDataset);
		return driverDataset;
		});
		
	}
	transformOptionsdriverSelect(options: Array<any>, value: string, label_1: string, label_2?: string, delimitter: string = ' ') {
        let tmpArr: Array<IOption> = [];
        options.forEach((option) => {
            tmpArr.push({
                value: option[value],
                label: label_2 ? `${option[label_1]} ${delimitter} ${option[label_2]}` : option[label_1],
                data: option
            })
        })
        return tmpArr;
    }
	
	
	
    uploadFile(file): Observable<any> {
        return this.http.post(`api/manualticket/uploadImage`, file).map(res => res.json());
    }

    updateFile(file): Observable<any> {
        return this.http.put(`api/manualticket/updateImage?ImageID=${file.ImageID}`, file).map(res => res.json());
    }

    getDistributerAndCopacker(): Observable<any> {
		
        if (this.cacheService.has("distributorcopacker")) {
		return this.cacheService.get("distributorcopacker");
		}
        return this.http.get('api/LoggedInUserDistributors').map((res) => res.json()).map((res) => {
		
			let distributors = this.transformOptionsReddySelect(res.DistributorCpoacker, 'DistributorCopackerID', 'Name');
			distributors.unshift({"value":0,"label":"Select Distributor/Copacker"});
            this.cacheService.set("distributorcopacker", distributors);
            return distributors;
        });
    }

    getDistributors(userId, selectedDate) {
        return this.http.get(`api/trip/listofdistributorfordate?Id=${userId}&Date=${selectedDate}`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }

    getBranchesByDate(userId, selectedDate) {
        return this.http.get(`api/trip/listofbranchesfordate?Id=${userId}&Date=${selectedDate}`)
            .map((res) => res.json()).map((res) => {
                return res;
            });
    }

    formatDate(date) {
        if (!date.year) { return '' };
        let yy = date.year, mm = date.month, dd = date.day;
        if (mm < 10) { mm = '0' + mm }
        if (dd < 10) { dd = '0' + dd }
        return yy + '-' + mm + '-' + dd;

    }

    transformOptionsReddySelect(options: Array<any>, value: string, label_1: string, label_2?: string, delimitter: string = '-') {
        let tmpArr: Array<IOption> = [];
        options.forEach((option) => {
            tmpArr.push({
                value: option[value],
                label: label_2 ? `${option[label_1]} ${delimitter} ${option[label_2]}` : option[label_1],
                data: option
            })
        })
        return tmpArr;
    }
	getDriverByBranch(searchDate,branchId, isInternal): Observable<any> {
		if (this.cacheService.has("drivers")) { return this.cacheService.get("drivers"); }
        return this.http.get(`api/user?CreateDate=${searchDate}&driverlistbybranch=${branchId}&isInternal=${isInternal}`).map((res) => res.json()).map((res) => {
		
		let driverUser:any[] = res.User;
		let driverDataset:any = [];
		driverUser.unshift({ 'UserId': 1, 'FirstName': 'All', 'LastName': 'Drivers' });
		driverDataset = this.transformOptionsReddySelect(driverUser, 'UserId', 'FirstName', 'LastName');
		
		this.cacheService.set("drivers", driverDataset);
		return driverDataset;
		});
		
	}
    getTicketType(isSaleTicket: boolean, customer: any, ticketTypeId: number, Is_PBM_DSD: number = 0, EDIUserName: boolean = false) {
        if (ticketTypeId === 29) {
            return 'DNS'
        } else if (ticketTypeId === 28) {
            return 'Payment Only'
        } else if (ticketTypeId === 30) {
            return 'Void'
        } else if (ticketTypeId === 110) {
            return 'Sale & Credit';
        } else if (customer.CustomerType === 20) {
            if (ticketTypeId === 26) {
                return 'Sale';
            } else {
                return 'Credit';
            }
        } else if (customer.CustomerType === 22) {
            if (isSaleTicket && ticketTypeId === 26) {
                return Is_PBM_DSD === 20 ? 'Sale' : 'PBM - Sale';
            } else if (isSaleTicket && ticketTypeId === 27) {
                return Is_PBM_DSD === 20 ? 'Credit' : 'PBM - Credit';
            } else {
                return 'PBM - Cons';
            }
        } else if (EDIUserName) {
            if (ticketTypeId === 26) {
                return 'PBS - Sale';
            } else {
                return 'PBS - Credit';
            }
        } else {
            return 'PBS - Cons';
        }
    }
}
