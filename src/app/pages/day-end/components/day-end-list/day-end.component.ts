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
    filter: any = {};

    trips: any = [];
    branches: Array<any> = [];
    distributors: Array<any> = [];
    logedInUser: any = {};

    userSubTitle: string = '';

    constructor(private service: DayEndService, private userService: UserService) { }

    ngOnInit() {
        this.logedInUser = this.userService.getUser();
        this.filter = this.service.getFilter();

        if (this.logedInUser.IsDistributor) {
            this.userSubTitle = ` - ${this.logedInUser.Distributor.DistributorName}`;
            this.filter.type = 'distributor';
            this.filter.userBranch = this.logedInUser.Distributor.DistributorMasterId || this.logedInUser.Distributor.DistributorMasterID;
        }
        this.selectionchangeHandler();
    }

    selectionchangeHandler() {
        this.loadFilteredTrips();
    }

    loadFilteredTrips() {
        this.service.getTrips(this.service.formatDate(this.filter.selectedDate)).subscribe((res) => {
            let distributors = [],
                branches = [];
            this.trips = res.Trips || [];
            let tmpDist = {};
            let tmpBranch = {};
            this.trips.forEach((trip) => {
                if (trip.isDistributor) {
                    if (tmpDist[trip.DistributorMasterID]) { return; }
                    distributors.push({
                        value: trip.DistributorMasterID,
                        label: trip.DistributorName
                    })
                    tmpDist[trip.DistributorMasterID] = trip.DistributorMasterID;
                    return;
                }
                if (tmpBranch[trip.BranchID]) { return; }
                branches.push({
                    value: trip.BranchID,
                    label: trip.BranchName
                })
                tmpBranch[trip.BranchID] = trip.BranchID
            })
            branches.length && branches.unshift({ value: 1, label: 'All Branches' });
            distributors.length && distributors.unshift({ value: 1, label: 'All Distributors' });
            this.distributors = distributors;
            this.branches = branches;

            // Hack for displaying Distributor in case of no data return
            if (this.logedInUser.IsDistributor && !this.distributors.length) {
                this.distributors = [{
                    value: this.logedInUser.Distributor.DistributorMasterId,
                    label: this.logedInUser.Distributor.DistributorName
                }]
            }
        });
    }
}
