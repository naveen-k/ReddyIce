import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './ticket-details.component.html',
    styleUrls: ['./ticket-details.component.scss'],
})
export class TicketDetailsComponent implements OnInit {
   
    selectedtrip:any = {};
    ticketDetails: any;
    tripId:string='';
    tripDate:any = '2017-08-31';
    tickDto:any = {TicketID:[], status: 1};

    constructor(private service: DayEndService) {
       
     //  this.ticketDetails = service.dataTableData3;
       this.selectedtrip = this.service.gettripData();
       this.tripId = this.selectedtrip.TripID;
       this.service.getTripDetailByDate(this.tripId, this.tripDate).subscribe((res) => {
         this.ticketDetails = res;
         console.log(res);
       }, (err) => {

       });
        
    }
     ngOnInit() {
        
     }
    submitTickets(){
        this.tickDto.TicketID = [];
        if(this.ticketDetails.TripDetails.length > 0){
            for(var i = 0; i < this.ticketDetails.TripDetails.length; i++){
             this.tickDto.TicketID.push(this.ticketDetails.TripDetails[i].TicketNumber);
            }
         console.log(this.tickDto);
         this.service.submitTickets(this.tickDto).subscribe((res)=>{},(err)=>{}); 
        }
     
      
    }
}
