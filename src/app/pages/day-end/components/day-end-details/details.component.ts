import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../shared/user.service';

@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    unitReconciliation: any;
    ticketDetails: any;
    Actual: any;
    Coins: any;
    subParams: any;
    uid: any;
    driverDetails: any = [];

    totalDeposit: any = "0.00";
    constructor(private service: DayEndService, private route: ActivatedRoute, private userService: UserService) {
        this.unitReconciliation = service.dataTableData2;
        this.ticketDetails = service.dataTableData3;

    }

    ngOnInit() {
        this.subParams = this.route
            .queryParams
            .subscribe(params => {
                // Defaults to 0 if no query param provided.
                this.uid = +params['uId'] || 0;
                this.userService.getUserDetails(this.uid).subscribe((res) => {
                    console.log(res);
                    this.driverDetails = res;
                }, (err) => {
                    console.log(err);
                });
            });
    }

    sortByWordLength = (a: any) => {
        return a.location.length;
    }
    doAddition() {
        this.totalDeposit = Number(this.Actual ? this.Actual : 0) + Number(this.Coins ? this.Coins : 0);
        return this.totalDeposit;
    }
}

