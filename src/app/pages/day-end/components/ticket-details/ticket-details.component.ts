import { User } from '../../../user-management/user-management.interface';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications/dist';
import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
    templateUrl: './ticket-details.component.html',
    styleUrls: ['./ticket-details.component.scss'],
})
export class TicketDetailsComponent implements OnInit {

    tripId: number;
    tripData: any = {};

    user: User= <User>{};

    total: any = {
        totalInvoice: 0,
        totalCash: 0,
        totalCheck: 0,
        totalCharge: 0,
        totalDrayage: 0,
        totalBuyBack: 0,
    };

    constructor(private service: DayEndService,
        private route: ActivatedRoute,
        private router: Router,
        private notification: NotificationsService,
        private userService: UserService,
    ) { }
    ngOnInit() {
        this.user = this.userService.getUser();
        
        this.tripId = +this.route.snapshot.params['tripId'];
        this.service.getTripDetailByDate(this.tripId).subscribe((res) => {
            this.tripData = res.Tripdetail[0];
            this.tripData.TripTicketList.forEach(ticket => {
                ticket.Customer = { CustomerName: ticket.CustomerName, CustomerID: ticket.CustomerID, CustomerType: ticket.CustomerType };
                this.total.totalInvoice += ticket.TotalSale || 0;
                this.total.totalCash += ticket.CashAmount || 0;
                this.total.totalCheck += ticket.CheckAmount || 0;
                this.total.totalCharge += ticket.ChargeAmount || 0;
                this.total.totalDrayage += ticket.Drayage || 0;
                this.total.totalBuyBack += ticket.BuyBack || 0;
            });

        }, (err) => {

        });
    }

    tripStatus(statusCode) {
        let statusText = '';
        switch (statusCode) {
            case 23:
                statusText = "Draft";
                break;
            case 24:
                statusText = "Submitted";
                break;
            case 25:
                statusText = "Approved";
                break;
            default:
                statusText = statusCode;
        }
        return statusText;
    }

    submitTickets() {
        this.service.saveRecociliation({ TripStatusID: 25, TripID: this.tripId }).subscribe((res) => {
            this.notification.success("Success", res);
            this.tripData.TripStatusID = 25;
            // this.router.navigate(['../list'])
        }, (err) => {
            err = JSON.parse(err._body);
            // this.notification.error("Error", err.Message);
        });
    }
}
