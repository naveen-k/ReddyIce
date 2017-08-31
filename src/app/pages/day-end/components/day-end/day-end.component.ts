import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component } from '@angular/core';

@Component({
    templateUrl: './day-end.component.html',
    styleUrls: ['./day-end.component.scss'],
})
export class DayEndComponent {
    
    isNewCustomer: boolean = true;
    userDataTable: any;
    unitReconciliation: any;
    ticketDetails: any;
    trips: any = [];
    date:any = "";
    branches:any = "";
    tripFilterDto:any = { BranchId: "1326", IsForAll: false, TripDate: ""};
    // Note - IsForAll is to see all trips or Mytrips (checker can view all Trips Mytrips while Driver can view only Mytrips) 
   
    showNewCustomer(newCustomer) {
        this.isNewCustomer = newCustomer;
    }

    constructor(private service: DayEndService) {
        this.userDataTable = service.dataTableData;
        this.unitReconciliation = service.dataTableData2;
        this.ticketDetails = service.dataTableData3;
         this.loadBranches();
         this.loadFilteredTrips();

    }
     selectionchangeHandler(){
           this.loadFilteredTrips();
     }   
     loadFilteredTrips(){
       //  if(this.tripFilterDto.TripDate) { this.tripFilterDto.TripDate = this.service.formatDate(this.tripFilterDto.TripDate); }
        console.log(this.tripFilterDto);
         this.service.getFilteredTrips(this.tripFilterDto).subscribe((res) => {
            console.log(res);
            this.trips = res;
        }, (error) => {
            console.log(error);
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
