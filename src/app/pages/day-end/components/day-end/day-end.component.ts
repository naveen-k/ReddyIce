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

    selectedDate:any = '2017-08-27';
    // contains all trips
    trips: any = [];
    // contains all Branches
    branches: any = "";
    customer:any = {};
    logedInUser:any = {};
    userBranch:any=[];

    // Note - IsForAll is to see all trips or Mytrips
    // (checker can view all Trips Mytrips while Driver can view only Mytrips) 
    
    tripFilterOption: any = { uId: "0", 
    tripDate: this.selectedDate,
     branchId: "0", isForAll: true};

    constructor(private service: DayEndService, private userService:UserService) {
        this.userDataTable = service.dataTableData;
        this.unitReconciliation = service.dataTableData2;
        this.ticketDetails = service.dataTableData3;
         this.selectedDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
 
        this.loadBranches();
        this.selectionchangeHandler();
        this.logedInUser = this.userService.getUser();
        console.log(this.logedInUser);
        this.userBranch=this.logedInUser.Branch.BranchName;
        

    }
    ngOnInit() {
         }
   
    selectionchangeHandler() {
           // uncomment bellow line once fixed(it is commented out as the APi is not supporting Date filter)
        console.log(this.selectedDate);
         this.tripFilterOption.tripDate = this.service.formatDate(this.selectedDate);
        console.log(this.tripFilterOption.tripDate);
        this.loadFilteredTrips();
    }
   
    loadFilteredTrips() {
        this.service.getTrips(this.tripFilterOption.uId, this.tripFilterOption.tripDate,
             this.tripFilterOption.branchId, this.tripFilterOption.isForAll).subscribe((res) => { 
                 if(typeof res == 'object') {
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
            this.branches = res;
            console.log(res);
        }, (error) => {
        });

    }
    cuurenttripData(data){
        this.service.setTripData(data);
    }


}
