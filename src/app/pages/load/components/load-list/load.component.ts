import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { LoadService } from '../../load.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
    templateUrl: './load.component.html',
    styleUrls: ['./load.component.scss'],
})
export class LoadComponent implements OnInit {
    filter: any = {};

    loads: any = [];
    selectedLoad: any[];
    branches: Array<any> = [];
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
        protected notification: NotificationsService) { }

    ngOnInit() {
        const now = new Date();
        this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.logedInUser = this.userService.getUser();
        this.filter = this.service.getFilter();
        this.getLoads();
    }
    
    getLoads() {
        this.service.getLoads(this.service.formatDate(this.filter.selectedDate),null,null,false).subscribe((res) => {
            this.loads = res.Loads;
            let tmpBranch = {}, branches = [];
            this.loads.forEach((load) => {
                if (tmpBranch[load.BranchID]) { return; }
                branches.push({
                    value: load.BranchID,
                    label: load.BranchName,
                    branchcode: load.BranchCode
                })
                tmpBranch[load.BranchID] = load.BranchID
            })
            this.branches = branches;

            this.showSpinner = false;
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
        this.selectedDate = this.service.formatDate(this.filter.selectedDate);
        this.branches = [];
        this.filter.userBranch = 0;
        this.filter.userDriver = 0;
        this.selectedLoad = [];
        this.getLoads();

    }
    // Fetch selected Branch
    branchChangeHandler() {
        console.log('tripFilterOption.branchId', this.filter.userBranch);
        if (this.filter.userBranch) {
            this.drivers = [];
            for (var i = 0; i < this.loads.length; i++) {
                if (this.filter.userBranch == this.loads[i].BranchID) {
                    this.drivers.push({
                        DriverName: this.loads[i].DriverName,
                        DriverID: this.loads[i].DriverID,
                        TripCode: this.loads[i].TripCode
                    });
                }
            }
            console.log(this.drivers);
            if (this.drivers && this.drivers.length > 0) {
                this.loadFilterOption.DriverName = this.drivers[0].DriverName;    // assigning in model
                this.loadFilterOption.DriverID = this.drivers[0].DriverID; 
                this.loadFilterOption.TripCode = this.drivers[0].TripCode;        // assigning in model
                this.driverChangeHandler();
            }

        } else {
            this.selectedLoad = [];
        }

        //this.loadTrips();
    }
    driverChangeHandler() {
        console.log('DriverName', this.loadFilterOption.DriverName);

    }


}
