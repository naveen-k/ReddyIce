import { IOption } from './components/multiple-select/multiple-select';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';


@Injectable()
export class SharedService {
    protected http: HttpService;

    private _branches: any;
    private _distributorCopacker: any;
    constructor(http: HttpService) { }

    getBranches(userId): Observable<any> {
        //if (this._branches) { return Observable.of(this._branches); }
        return this.http.get(`api/DistributorBranches?Id=${userId}`).map((res) => res.json()).map((res) => {
            // Cache branch response
            this._branches = res;
            return res;
        });
    }

    getDriverByBranch(branchId, isInternal): Observable<any[]> {
        return this.http.get(`api/user?driverlistbybranch=${branchId}&isInternal=${isInternal}`).map(res => res.json());
    }

    uploadFile(file): Observable<any> {
        return this.http.post(`api/manualticket/uploadImage`, file).map(res => res.json());
    }

    updateFile(file): Observable<any> {
        return this.http.put(`api/manualticket/updateImage?ImageID=${file.ImageID}`, file).map(res => res.json());
    }

    getDistributorsByBranch(branchId: string): Observable<any[]> {
        let url = `api/DistributorBranches`;
        if (branchId) {
            url = `api/DistributorBranches?BranchId=${branchId}`;
        }
        return this.http.get(url).map((res) => res.json());
    }

    getDistributerAndCopacker(): Observable<any> {
        if(this._distributorCopacker){return Observable.of(this._distributorCopacker);}
        return this.http.get('api/Distributor').map((res) => res.json()).map((res) => {
            this._distributorCopacker = res;
            return res;
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
            if(ticketTypeId === 26){
                return 'PBS - Sale';
            } else{
                return 'PBS - Credit';
            }
        } else {
            return 'PBS - Cons';
        }
    }
}
