import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { LoadService } from '../../load.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './load.component.html',
    styleUrls: ['./load.component.scss'],
})
export class LoadComponent implements OnInit {
    filter: any = {};

    loads: any = [];
    filteredLoads: any = [];
    branches: Array<any> = [];
    allBranches: Array<any> = [];
    drivers: Array<any> = [];
    distributors: Array<any> = [];
    logedInUser: any = {};
    todaysDate: any;
    totalCreditAmount: any = 0;
    selectedDate: any;
    userSubTitle: string = '';
    showSpinner: boolean = false;
    loadFilterOption: any = {
        uId: '0',
        loadDate: this.selectedDate,
        branchId: 0,
        branchName: '',
        isForAll: false,
        TripCode: 1,
        DriverName: '',
        DriverID: ''
    };
    constructor(private service: LoadService, private userService: UserService,
        protected notification: NotificationsService,
        protected activatedRoute: ActivatedRoute, ) { }

    ngOnInit() {
        const now = new Date();
        this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.logedInUser = this.userService.getUser();
        this.filter = this.service.getFilter();
        let branches = this.activatedRoute.snapshot.data['branches'];
        if (branches && branches.length) {
            if ((branches.length > 0) && (branches[0] === null || branches[0].BranchID === 1)) {
                branches.shift();
            }
        }
        this.allBranches = this.service.transformOptionsReddySelect(branches, 'BranchID', 'BranchCode', 'BranchName');
        this.dateChangeHandler();
    }
    getDrivers(byType: any = '') {
        if (this.filter.userBranch === null) {
            return;
        }
        this.service.getDriverByBranch(this.filter.userBranch, true).subscribe(res => {
            let objDriver = [];
            res = res || [];
            objDriver = this.service.transformOptionsReddySelect(res, 'UserId', 'UserName');

            this.drivers = objDriver;
        });
    }
    branchChangeHandler(byType: any = '') {
        //this.searchObj.UserId = null;
        this.drivers = [];
        this.filteredLoads = [];
        this.filter.userDriver = 0;
        this.getDrivers(byType);
    }
    userChangeHandler() {

        this.getLoadsFromList(this.filter.userBranch, this.filter.userDriver);
    }
    getLoadsFromList(branchID, driverID) {

        this.filteredLoads = [];
        let tempLoad = [];
        let fLoad = [];
        if (this.loads.length && this.loads.length > 0) {
            this.loads.forEach((load) => {
                //if (branchID === load.BranchID && driverID === load.DriverID) {
                    fLoad.push(load);
                //}
            });
        }
        this.filteredLoads = fLoad;
    }
    getLoads() {
        this.service.getLoads(this.service.formatDate(this.filter.selectedDate), null, null, false).subscribe((res) => {
            this.loads = res;
            this.showSpinner = false;
            this.filteredLoads = [];
            if (this.filter.userBranch > 0 && this.filter.userDriver > 0)
                this.getLoadsFromList(this.filter.userBranch, this.filter.userDriver);
        },
            (error) => {
                this.showSpinner = false;
                if (error) {

                    this.notification.error('', 'Something went wrong while fetching data');
                }
            }
        );
    }

    dateChangeHandler() {
        this.showSpinner = true;
        this.selectedDate = this.service.formatDate(this.filter.selectedDate);
       // this.filter.userBranch = 0;
       // this.filter.userDriver = 0;
        this.getLoads();

    }
    driverChangeHandler() {
        console.log('DriverName', this.loadFilterOption.DriverName);

    }

}
