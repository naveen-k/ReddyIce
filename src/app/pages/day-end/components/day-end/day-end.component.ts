import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component } from '@angular/core';

@Component({
    templateUrl: './day-end.component.html',
    styleUrls: ['./day-end.component.scss'],
})
export class DayEndComponent {
    userDataTable: any;
    unitReconciliation: any;
    ticketDetails: any;

    selectedDate:any = '';
    // contains all trips
    trips: any = [];
    // contains all Branches
    branches: any = "";

    // Note - IsForAll is to see all trips or Mytrips
    // (checker can view all Trips Mytrips while Driver can view only Mytrips) 
    tripFilterDto: any = { BranchId: "", IsForAll: true, TripDate: ""};



    constructor(private service: DayEndService) {
        this.userDataTable = service.dataTableData;
        this.unitReconciliation = service.dataTableData2;
        this.ticketDetails = service.dataTableData3;
       
        this.loadBranches();
        this.loadFilteredTrips();

    }
   
    selectionchangeHandler() {
        this.loadFilteredTrips();
    }
   
    loadFilteredTrips() {

        //uncomment bellow line once fixed(it is commented out as the APi is not supporting Date filter)
      
        //  this.tripFilterDto.TripDate = this.service.formatDate(this.selectedDate);
      
      console.log(this.tripFilterDto);
        this.service.getFilteredTrips(this.tripFilterDto).subscribe((res) => {
            this.trips = res;
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
        }, (error) => {
        });

    }


}
