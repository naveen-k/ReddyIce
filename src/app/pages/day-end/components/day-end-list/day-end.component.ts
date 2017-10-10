import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/user.service';

@Component({
    templateUrl: './day-end.component.html',
    styleUrls: ['./day-end.component.scss'],
})
export class DayEndComponent implements OnInit {
    userDataTable: any;
    unitReconciliation: any;
    ticketDetails: any;

    filter: any = {};

    selectedDate: any = '2017-08-27';
    // contains all trips
    trips: any = [];
    // contains all Branches
    branches: Array<any> = [];
    customer: any = {};
    logedInUser: any = {};
    userBranch: any = '0';
    isDistributorExist: boolean;
    userSubTitle: string = '';

    // Note - IsForAll is to see all trips or Mytrips
    // (checker can view all Trips Mytrips while Driver can view only Mytrips) 

    tripFilterOption: any = {
        uId: "0",
        tripDate: this.selectedDate,
        branchId: '0', isForAll: false
    };

    constructor(private service: DayEndService, private userService: UserService) { }

    ngOnInit() {
        const userId = localStorage.getItem('userId') || '';
        this.userService.getUserDetails(userId).subscribe((response) => {
            this.isDistributorExist = response.IsDistributor;
            this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + response.Distributor.DistributorName : '';
        });



        this.filter = this.service.getFilter();
        // this.selectedDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
        this.loadBranches();
        this.logedInUser = this.userService.getUser();
        this.userBranch = this.logedInUser.Branch ? this.logedInUser.Branch.BranchID : null;
        if (this.logedInUser.Role.RoleID == 1 || this.logedInUser.Role.RoleID == 2) {
            this.tripFilterOption.isForAll = true;
        }
        this.tripFilterOption.branchId = this.filter.userBranch;
        this.selectionchangeHandler();

    }

    selectionchangeHandler() {
        // uncomment bellow line once fixed(it is commented out as the APi is not supporting Date filter)
        this.tripFilterOption.tripDate = this.service.formatDate(this.filter.selectedDate);
        this.tripFilterOption.branchId = this.filter.userBranch ? this.filter.userBranch : null;
        this.loadFilteredTrips();

    }

    loadFilteredTrips() {
        this.service.getTrips(this.tripFilterOption.tripDate, this.tripFilterOption.branchId || 1).subscribe((res) => {
            if (typeof res == 'object') {
                this.trips = res.Trips;
            }
            else {
                this.trips = [];
            }

        }, (error) => {
            console.log(error);
            this.trips = [];
        });
    }
    getTripByDate(date) {
        date = this.service.formatDate(date);
        this.service.getTripsByDate(date).subscribe((res) => {
            this.trips = res;
        }, (error) => {
        });
    }

    loadBranches() {
        const userId = localStorage.getItem('userId');
        this.service.getBranches(userId).subscribe((res) => {
            let tempArr = []
            res.forEach(branch => {
                tempArr.push({
                    value: branch.BranchID,
                    label: `${branch.BranchCode} - ${branch.BranchName}`,
                    date: branch
                })
            });
            this.branches = tempArr;            
        }, (error) => {
        });

    }

    cuurenttripData(data) {
        this.service.setTripData(data);
    }


}
