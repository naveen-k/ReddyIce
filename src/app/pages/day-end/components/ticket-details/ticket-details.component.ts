import { User } from '../../../user-management/user-management.interface';
import { UserService } from '../../../../shared/user.service';
import { NotificationsService } from 'angular2-notifications';
import { any } from 'codelyzer/util/function';
import { LocalDataSource } from 'ng2-smart-table';
import { DayEndService } from '../../day-end.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { CurrencyFormatter } from 'app/shared/pipes/currency-pipe';
import { GenericSort } from 'app/shared/pipes/generic-sort.pipe';

@Component({
    templateUrl: './ticket-details.component.html',
    styleUrls: ['./ticket-details.component.scss'],
    providers:[DatePipe,CurrencyFormatter,GenericSort]
})
export class TicketDetailsComponent implements OnInit {

    tripId: number;
    tripData: any = {};

    isDistributorExist: boolean;
    userSubTitle: string = '';

    user: User = <User>{};

    total: any = {
        totalInvoice: 0,
        totalCash: 0,
        totalCheck: 0,
        totalCharge: 0,
        totalDrayage: 0,
        totalBuyBack: 0,
        totalDistAmt: 0,
    };
    customer: any = {sortField: '', isAsc: false};
    printStatus:boolean = false;
    logedInUser: any = {};    
    constructor(private service: DayEndService,
        private route: ActivatedRoute,
        private router: Router,
        private notification: NotificationsService,
        private userService: UserService,
        private date: DatePipe,
        private currencyFormatter:CurrencyFormatter,
        private sort:GenericSort        
    ) { }


    ngOnInit() {
        const userId = localStorage.getItem('userId') || '';
        this.userService.getUserDetails(userId).subscribe((response) => {
            this.isDistributorExist = response.IsDistributor;
            this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + response.Distributor.DistributorName : '';
        });
        this.logedInUser = this.userService.getUser();
        this.user = this.userService.getUser();

        this.tripId = +this.route.snapshot.params['tripId'];
        this.service.getTripDetailByDate(this.tripId).subscribe((res) => {
            this.tripData = res.Tripdetail[0];
            this.tripData.TripTicketList.forEach(ticket => {
               
                ticket.Customer = { CustomerName: ticket.CustomerName, CustomerID: ticket.CustomerID, CustomerType: ticket.CustomerType };
                ticket.ticketType = this.service.getTicketType(ticket.IsSaleTicket, ticket.Customer, ticket.TicketTypeID, ticket.CustomerTypeID);
                ticket.amount = ticket.TotalSale + ticket.TaxAmount;
                ticket.checkCashAmount = (ticket.TicketTypeID === 30)?0:ticket.CheckAmount + ticket.CashAmount;
                if (ticket.TicketTypeID === 30) { return; }
                this.total.totalInvoice += ticket.TicketTypeID !== 27 ? (ticket.TotalSale + ticket.TaxAmount) : (ticket.TotalSale + ticket.TaxAmount) || 0;
                this.total.totalCash += ticket.CashAmount || 0;
                this.total.totalCheck += ticket.CheckAmount || 0;
                this.total.totalCharge += ticket.ChargeAmount || 0;
                this.total.totalDrayage += ticket.Drayage || 0;
                this.total.totalBuyBack += ticket.BuyBack || 0;
                this.total.totalDistAmt += ticket.DistAmt || 0;
            });
            this.printStatus = true;
        }, (err) => {
            this.printStatus = false;
        });
    }

    tripStatus(statusCode) {
        let statusText = '';
        switch (statusCode) {
            case 23:
                statusText = 'Draft';
                break;
            case 24:
                statusText = 'Submitted';
                break;
            case 25:
                statusText = 'Approved';
                break;
            default:
                statusText = statusCode;
        }
        return statusText;
    }

    submitTickets(tripStatus) {
        const preTripStatus = this.tripData.TripStatusID;
        this.tripData.TripStatusID = tripStatus;
        this.service.saveRecociliation({ TripStatusID: tripStatus, TripID: this.tripId }).subscribe((res) => {
            this.notification.success('Success', res);
        }, (err) => {
            this.tripData.TripStatusID = preTripStatus;
        });
    }

    viewTicket(ticketID) {
        if (ticketID) {
            window.open(environment.reportEndpoint + "?Rtype=TK&TicketID=" + ticketID, "Ticket", "width=560,height=700,resizable=yes,scrollbars=1");
        } else {
            this.notification.error("Ticket preview unavailable!!");
        }

    }
    popupWin: any;
    printReconciliation() {
        let printContents, printContentsHead, tabName='';
        //printContentsHead = document.getElementById('day-end-list-head').innerHTML;
        let mainData = '';//window.document.getElementById('cashContainer').innerHTML;
        mainData =this.printHeaderData()+"<br/>";
        mainData += this.printDetailData();
        tabName = this.userSubTitle;
        if(this.popupWin){this.popupWin.close();}
        setTimeout(()=>{
        this.popupWin = window.open('', '_new', 'top=0,left=0,height="100%",width="100%",fullscreen="yes"');
        this.popupWin.document.open();
        this.popupWin.document.write(`
          <html>
            <head>
              <title>Trip Details-${tabName}</title>
              <style>
              //........Customized style.......
              </style>
            </head>
            <body onload="window.print();window.close();">${mainData}</body>
          </html>`
            );
            this.popupWin.document.close();
        }, 1000);
    }
    printHeaderData(){
        let selectedData = '';
        let sdateData = this.date.transform(this.tripData.TripStartDate);
        let edateData = this.date.transform(this.tripData.TripEndDate);
        let tripStatus = this.tripStatus(this.tripData.TripStatusID)
        selectedData = `<table cellpadding="5" border=1 style="border-collapse: collapse;" width="100%"><tr><td><table width="100%">
        <thead>
        <tr>
            <th align="left">Business Unit:</th>
            <th align="left">Route:</th>
            <th align="left">Driver:</th>
            <th align="left">HH Day End:</th>
            <th align="left">Trip Start Date:</th>
            
        </tr>        
        <tr>
            <td align="left">${this.tripData.BranchCode} - ${this.tripData.BUName}</td>
            <td align="left">${(this.tripData.IsUnplanned)?'Unplanned':this.tripData.RouteNumber}</td>
            <td align="left">${this.tripData.DriverName}</td>
            <td align="left">${(this.tripData.IsClosed)?'Yes':'No'}</td>
            <td align="left">${sdateData}</td>
            
        </tr>
        <tr>
            <th align="left">Trip Code:</th>
            <th align="left">Truck:</th>
            <th align="left">Status:</th>
            <th align="left">ERP Processed:</th>
            <th align="left">Trip End Date:</th>
        </tr>
        <tr>
            <td align="left">${this.tripData.TripCode}</td>
            <td align="left">${this.tripData.TruckID}</td>
            <td align="left">${tripStatus}</td>
            <td align="left">${(this.tripData.IsProcessed)?'Yes':'No'}</td>
            <td align="left">${edateData != null ? edateData : ''}</td>
        </tr>
        </thead>
        </table></td></tr></table>`;
        return selectedData;
    }    
    printDetailData(){
        let table = '',tbody='',thead='';//window.document.getElementById('detailsContainer').innerHTML;

       table =` <table cellpadding="5" border=1 style="border-collapse: collapse;" width="100%">`;
thead =`<thead>
            <tr>
                <th>
                    Ticket #
                </th>
                <th>
                    Ticket Type
                </th>
                <th align="left">
                    Customer
                </th>
                <th class="textRightPadd">
                    Total Invoice
                </th>
                <th class="textRightPadd">
                    Received Amt
                </th>
                ${this.user.Role.RoleID!='3' ? `${this.logedInUser.IsDistributor && this.logedInUser.Distributor.IsCopacker ? '' : `<th class="textRightPadd">
                Drayage
                </th>`}` : ''}
                ${this.user.Role.RoleID!='3' ? `${this.logedInUser.IsDistributor && this.logedInUser.Distributor.IsCopacker ? '' : `<th class="textRightPadd">
                Buyback
                </th>`}` : ''}
                <th class="text-align-center">
                    RI Internal
                </th>
                </tr>
        </thead>`;
        table += thead;

        tbody =`<tbody>`;

        // if(this.tripData && this.tripData.TripTicketList && this.tripData.TripTicketList.length>0)
        // {
            let tripDataList = this.sort.transform(this.tripData.TripTicketList,this.customer.sortField,this.customer.isAsc);
            tripDataList.forEach(item => {
                tbody +=`<tr >
                    <td class="text-align-left">${item.TicketNumber }</td>
                    <td>${item.ticketType}</td>
                    <td align="left">
                        ${item.AXCustomerNumber } - ${item.CustomerName }
                    </td>
                    <td align="right" style="${(item.TicketTypeID === 27)?'color:red':''}">
                        ${(item.TicketTypeID === 27)?'('+this.currencyFormatter.transform(item.amount)+')':this.currencyFormatter.transform(item.amount)} 
                    </td>
                    <td align="right">
                        <span>${(item.TicketTypeID == 30)?'$0.00':item.checkCashAmount ?(this.currencyFormatter.transform(item.checkCashAmount)) : ''}</span>
                    </td>
                    
                    ${(this.user.Role.RoleID!='3' && (!item.Drayage)) ? 
                    `${this.logedInUser.IsDistributor && this.logedInUser.Distributor.IsCopacker ? '' :
                    `<td align="right"></td>` }`
                     : ''}

                    ${(this.user.Role.RoleID!='3' && (item.Drayage)) ? 
                    `${this.logedInUser.IsDistributor && this.logedInUser.Distributor.IsCopacker ? '' :
                    `<td align="right" class="textRightPadd" style="color: ${item.TicketTypeID === 27 ? 'red' : ''}">
                    ${item.TicketTypeID === 27 ? `<span>(</span>` : ''}${this.currencyFormatter.transform(item.Drayage)} ${item.TicketTypeID === 27 ? `<span>)</span>` : ''}</td>`
                    }`
                    : ''}
                    
                    ${(this.user.Role.RoleID!='3' && (!item.BuyBack)) ? 
                    `${this.logedInUser.IsDistributor && this.logedInUser.Distributor.IsCopacker ? '' :
                    `<td align="right"></td>`}`
                     : ''}

                    ${(this.user.Role.RoleID!='3' && (item.BuyBack)) ? 
                    `${this.logedInUser.IsDistributor && this.logedInUser.Distributor.IsCopacker ? '' :
                    `<td align="right" style="color: ${item.TicketTypeID === 27 ? 'red' : ''}">
                    ${item.TicketTypeID === 27 ? `<span>(</span>` : ''}${this.currencyFormatter.transform(item.BuyBack)}${item.TicketTypeID === 27 ?`<span>)</span>` : ''}</td>`}`
                     : ''}     
                                   
                    <td align="right">
                        <input type="checkbox" disabled name="riInternal" ${item.CustomerSourceID===101 ? 'checked' : ''}>
                    </td>                    
                </tr>`;
            });
            
                tbody +=`<tr style="background:#CCC">
                    <td colspan="3" align="center">
                        <b>Total</b>
                    </td>
                    <td align="right">
                        <b>${this.currencyFormatter.transform(this.total.totalInvoice)}</b>
                    </td>
                    <td align="right">
                        <b>${this.currencyFormatter.transform(this.total.totalCash + this.total.totalCheck)}</b>
                    </td>
                    ${(this.user.Role.RoleID!='3') ? 
                    `${this.logedInUser.IsDistributor && this.logedInUser.Distributor.IsCopacker ? '' :
                    `<td align="right" class="textRightPadd" ><b>${(this.user.Role.RoleID!='3') ? this.currencyFormatter.transform(this.total.totalDrayage) : ''}</b></td>`}`
                    : ''}                  
                    ${(this.user.Role.RoleID!='3') ? 
                    `${this.logedInUser.IsDistributor && this.logedInUser.Distributor.IsCopacker ? '' :
                    `<td align="right" class="textRightPadd"><b>${(this.user.Role.RoleID!='3') ? this.currencyFormatter.transform(this.total.totalBuyBack): ''}</b></td>`}`
                     : ''}
                    <td></td>                    
                </tr>`;
        // }  else {
        //     tbody +=`<tr><td colspan="6">No Records Found.<td><tr>`;
        // }                        
               
                tbody +=`</tbody>`;
                table += tbody;
                table +=`</table>`;


        return table;
    }    
}
