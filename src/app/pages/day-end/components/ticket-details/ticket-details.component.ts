import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './ticket-details.component.html',
    styleUrls: ['./ticket-details.component.scss'],
})
export class TicketDetailsComponent implements OnInit {

    selectedtrip: any = {};
    TripData: any;
    tripId: number;
    tickDto: any = { TicketID: [], status: 1 };

    constructor(private service: DayEndService, private route:ActivatedRoute) {

        this.tripId = +this.route.snapshot.params['tripId'];
        this.service.getTripDetailByDate(this.tripId).subscribe((res) => {
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
