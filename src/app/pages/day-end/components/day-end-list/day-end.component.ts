import { any } from 'codelyzer/util/function';
import { ActivatedRoute } from '@angular/router';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications';
import { forEach } from '@angular/router/src/utils/collection';
import { DayEndPipe } from 'app/pages/day-end/components/day-end-list/day-end-list.pipe';
import { GenericSort } from 'app/shared/pipes/generic-sort.pipe';

@Component({
    templateUrl: './day-end.component.html',
    styleUrls: ['./day-end.component.scss'],
    providers: [DayEndPipe, GenericSort]
})
export class DayEndComponent implements OnInit {
    filter: any = {};
    customer: any = {sortField: '', isAsc: false};
    trips: any = [];
    branches: Array<any> = [];
    distributors: Array<any> = [];
    logedInUser: any = {};
    todaysDate: any;
    totalCreditAmount: any = 0;
    showBranchDropdown: boolean = false;

    userSubTitle: string = '';
    showSpinner: boolean = false;
    constructor(private service: DayEndService, private userService: UserService,
        protected notification: NotificationsService, private dayEndPipe: DayEndPipe, private genericSort: GenericSort) { }

    ngOnInit() {
        const now = new Date();
        this.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.logedInUser = this.userService.getUser();
        this.filter = this.service.getFilter();
        if (this.logedInUser.IsDistributor) {
            this.userSubTitle = ` - ${this.logedInUser.Distributor.DistributorName}`;
        }

        if (this.logedInUser.Role.RoleID === 3 && this.logedInUser.IsSeasonal) {
            this.logedInUser.IsRIInternal = true;
            this.logedInUser.IsDistributor = false;
        }

        //Check if LogedIn User is Seasonal Distributor or not 

        // if (!this.logedInUser.IsRIInternal) {
        //     if (this.logedInUser.Role.RoleID === 3) {
        //         if (this.logedInUser.IsSeasonal) {
        //             this.showBranchDropdown = true;
        //         } else {
        //             this.showBranchDropdown = false;
        //         }
        //     }
        // }


        this.selectionchangeHandler();
        //for(let i=0;i<this.trips.length;i++)
    }

    selectionchangeHandler() {
        this.loadFilteredTrips();
    }

    loadFilteredTrips() {
        this.totalCreditAmount = 0;
        this.showSpinner = true;
        this.trips = [];
        this.service.getTrips(this.service.formatDate(this.filter.selectedDate)).subscribe((res) => {
            let distributors = [],
                branches = [];
            this.trips = res.DayEnd || [];
            let tmpDist = {};
            let tmpBranch = {};
            this.trips.forEach((trip) => {

                trip.isDistributor = !!trip.DistributorMasterID;
                if (this.logedInUser && this.logedInUser.IsSeasonal && this.logedInUser.Role.RoleID === 3) {
                    trip.isDistributor = 0;
                }
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
                    label: `${trip.BranchCode}-${trip.BranchName}`
                })
                trip.branch = `${trip.BranchCode} - ${trip.BranchName}`;
                tmpBranch[trip.BranchID] = trip.BranchID;
            })

            branches.unshift({ value: 1, label: 'All Branches' });
            distributors.length && distributors.unshift({ value: 1, label: 'All Distributors' });
            this.distributors = distributors;
            this.branches = branches;
            if (!this.filter.userBranch) {
                this.filter.userBranch = 1;
            }

            // Hack for displaying Distributor in case of no data return
            if (this.logedInUser.IsDistributor && !this.distributors.length) {
                this.distributors = [{
                    value: this.logedInUser.Distributor.DistributorMasterId,
                    label: this.logedInUser.Distributor.DistributorNumber + '-' + this.logedInUser.Distributor.DistributorName
                }]
            }
            this.showSpinner = false;
        },
            (error) => {
                this.showSpinner = false;
                if (error) {

                    this.notification.error('', 'Something went wrong while fetching data');
                }
            }, );
    }
    /**
     * This functiuon is used for print the list of day-end trip
     */
    printPage() {
        let printContents, printContentsHead, popupWin; console.log(document.getElementById('day-end-list-head'));
        //printContentsHead = document.getElementById('day-end-list-head').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height="100",width="100%",fullscreen="yes"');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Day End Trip List</title>
              <style>
              //........Customized style.......
              </style>
            </head>
            <body onload="window.print();window.close()">${this.populatePrintData()}</body>
          </html>`
        );
        popupWin.document.close();
    }
    /**
     * This functiuon is used for prepare the list of trips as a print format
     */
    populatePrintData() {
        let tbody = '', thead = '', table = '', selectedData = '', branch: any = {};
        let filterDataForPrint: any = [];
        filterDataForPrint = this.dayEndPipe.transform(this.trips, this.filter.type, this.filter.userBranch);debugger;
        filterDataForPrint=this.genericSort.transform(filterDataForPrint,this.customer.sortField,this.customer.isAsc);
        if (this.filter.type === 'internal') {
            branch = this.branches.filter(item => item.value === this.filter.userBranch)[0];
        } else if (this.filter.type === 'distributor') {
            branch = this.distributors.filter(item => item.value === this.filter.userBranch)[0];
        }
        selectedData += `<table width="100%">
        <thead>
        <tr>
            <th align="left">Delivery Date</th>
            <th align="left">Driver Type</th>
            ${this.filter.type === 'internal' ? '<th align="left">Branch</th>' : ''}
            ${this.filter.type === 'distributor' ? '<th align="left">Distributor</th>' : ''}
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>${this.filter.selectedDate.day}-${this.filter.selectedDate.month}-${this.filter.selectedDate.year}</td>
            <td>${this.filter.type == 'internal' ? 'RI Internal' : this.filter.type == 'distributor' ? 'Distributor' : ''}</td>
            <td>${branch ? branch.label : ''}</td>
        </tr>
        </tbody>
        </table>`
        thead += `
        <thead class="tableHeader">
            <tr>
                ${this.logedInUser.IsRIInternal ? '<th>Route #</th>' : ''}
                ${this.logedInUser.IsRIInternal ? '<th>Branch</th>' : ''}
                <th>Driver</th>
                <th>Trip Code</th>
                <th>Total Sale</th>
                <th>Received Amt</th>
                <th>HH Day End</th>
                <th># of Tickets</th>
                <th>Status</th>                          
            </tr>
        </thead>`
        tbody += `<tbody >`;
        if (filterDataForPrint && filterDataForPrint.length <= 0) {
            tbody += `<tr><td colspan="11" align="center">No data found</td></tr>`
        } else {
            filterDataForPrint.forEach(item => {
                tbody += `<tr> ${(this.logedInUser.IsRIInternal) && `<td>${!item.IsUnplanned ? item.RouteNumber : 'Unplanned'}</td>`}
                ${(this.logedInUser.IsRIInternal) ? `<td>${item.BranchCode}-${item.BranchName}</td>` : ''}
                <td>${item.DriverName}</td>
                <td>${item.TripCode}</td>
                <td>$${item.TripTotalSale}</td>
                <td>$${item.TripTotalAmount}</td>
                <td><input type="checkbox" name="tripHHMultiSelect" disabled ${item.IsClosed && 'checked'}></td>
                <td>${item.NoOfTickets}</td>
                <td>
                    <i class="custom-tooltip-ion">
                    ${item.TripStatusID == 23 ? '<span class="tooltiptext">Draft</span>' : ''}
                    ${item.TripStatusID == 24 ? '<span class="tooltiptext">Submitted</span>' : ''}
                    ${item.TripStatusID == 25 ? '<span class="tooltiptext">Approved</span>' : ''}
                    </i>            
                </td>
                </tr>`
            });
        }
        tbody += `</tbody>`;
        table = `${selectedData}<br/><table cellpadding="5" border=1 style="border-collapse: collapse;">${thead}${tbody}</table>`;
        return table;
    }
    sortable(name){
        this.customer.sortField = name;
        this.customer.isAsc=!this.customer.isAsc;
    }
}
