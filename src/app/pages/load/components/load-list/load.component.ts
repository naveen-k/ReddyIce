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
        this.branches = this.activatedRoute.snapshot.data['branches'];
        if (this.branches && this.branches.length) {
            if ((this.branches.length > 0) && (this.branches[0] === null || this.branches[0].BranchID === 1)) {
                this.branches.shift();
            }
        }
        this.allBranches = this.service.transformOptionsReddySelect(this.branches, 'BranchID', 'BranchCode', 'BranchName');
        if(this.filter.userBranch && this.filter.userBranch>0){
            this.getDrivers();
        }
        
        this.dateChangeHandler();
        
    }
    getDrivers(byType: any = '') {
        this.logedInUser.Role.RoleID === 3 && (this.filter.userDriver = this.logedInUser.UserId);
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
        this.logedInUser.Role.RoleID != 3 && (this.drivers = []);
        this.filteredLoads = [];
        this.filter.userDriver = 0
        this.filter.userDriver = 0;
        this.getDrivers(byType);
    }
    userChangeHandler() {
        this.getBranchName();
        this.getDriverName();
       
        
        this.getLoadsFromList(this.filter.userBranch, this.filter.userDriver);
    }
    getBranchName(){
        let b = this.branches.filter((b)=>b.BranchID === this.filter.userBranch);
        this.filter.userBranchName = b[0].BranchCode +' - '+b[0].BranchName;
    }
    getDriverName(){
        let d = this.drivers.filter((d)=>d.value === this.filter.userDriver);
        this.filter.userDriverName = d[0].label;
    }
    getLoadsFromList(branchID, driverID) {

        this.filteredLoads = [];
        let tempLoad = [];
        let fLoad = [];
        if (typeof this.loads === 'object' && this.loads && this.loads.length && this.loads.length > 0) {
            
            this.loads.forEach((load) => {
                //if (branchID === load.BranchID && driverID === load.DriverID) {
                    fLoad.push(load);
                //}
            });
            this.filter.tripCode = fLoad.length;
        }
        this.filteredLoads = fLoad;
    }
    getLoads() {
        this.service.getLoads(this.service.formatDate(this.filter.selectedDate), null, null, false).subscribe((res) => {
            this.loads = res;
            this.showSpinner = false;
            this.filteredLoads = [];
            if (this.filter.userBranch > 0 && this.filter.userDriver > 0){
                this.getLoadsFromList(this.filter.userBranch, this.filter.userDriver);
            }
               
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

}
