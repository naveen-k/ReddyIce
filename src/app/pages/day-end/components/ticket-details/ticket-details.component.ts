import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './ticket-details.component.html',
    styleUrls: ['./ticket-details.component.scss'],
})
export class TicketDetailsComponent implements OnInit {

    selectedtrip: any = {};
    TripData: any;
    tripId: string = '';
    tripDate: any = '2017-08-31';
    tickDto: any = { TicketID: [], status: 1 };

    constructor(private service: DayEndService) {


        this.selectedtrip = this.service.getTripData();
        this.tripId = this.selectedtrip.TripID;
        // this.tripDate = this.selectedtrip.Created.split('T')[0];
        this.service.getTripDetailByDate(this.tripId, this.tripDate).subscribe((res) => {
            this.TripData = res;
            this.selectedtrip = res.Tripdetail[0];
            console.log(this.TripData);
        }, (err) => {

        });

    }
    ngOnInit() {

    }
    submitTickets() {
        this.tickDto.TicketID = [];
        const limit = this.TripData.Tripdetail[0].TripTicketList.length;
        if (limit > 0) {
            for (let i = 0; i < limit; i++) {
                this.tickDto.TicketID.push(this.TripData.Tripdetail[0].TripTicketList[i].TicketNumber);
            }
            console.log(this.tickDto);
            this.service.submitTickets(this.tickDto).subscribe((res) => { }, (err) => { });
        }


    }
}
