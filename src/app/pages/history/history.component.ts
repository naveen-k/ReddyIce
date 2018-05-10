import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../_animations/index';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'history',
  templateUrl: './history.html',
  styleUrls: ['./history.scss'],
  animations: [slideInOutAnimation],
  host: { '[@slideInOutAnimation]': '' }
})
export class History implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) { }
    orderData:Array<any>;
    equipmentData:Array<any>;
    invoiceData:Array<any>;
  ngOnInit() {
    console.log("hello");
    // Just to make sure `auth_token` is clear when, landed on this page
    this.orderData = [
      {
        mode : 1,
        Order : '111-222-333',
        OrderDate : '2/9/2018',
        LatestDelivery:'2/9/2018',
        Status: 'Open'
      },
      {
        mode : 1,
        Order : '111-222-333',
        OrderDate : '2/9/2018',
        LatestDelivery:'2/9/2018',
        Status: 'Close'
      },
      {
        mode : 1,
        Order : '111-222-333',
        OrderDate : '2/9/2018',
        LatestDelivery:'2/9/2018',
        Status: 'Open'
      },
      {
        mode : 1,
        Order : '111-222-333',
        OrderDate : '2/9/2018',
        LatestDelivery:'2/9/2018',
        Status: 'Close'
      }
  ];
  this.equipmentData = [
    {
      mode : 1,
      Order : '111-222-333',
      OrderDate : '2/9/2018',
      LatestDelivery:'2/9/2018',
      Status: 'Open'
    },
    {
      mode : 1,
      Order : '111-222-333',
      OrderDate : '2/9/2018',
      LatestDelivery:'2/9/2018',
      Status: 'Close'
    },
    {
      mode : 1,
      Order : '111-222-333',
      OrderDate : '2/9/2018',
      LatestDelivery:'2/9/2018',
      Status: 'Open'
    },
    {
      mode : 1,
      Order : '111-222-333',
      OrderDate : '2/9/2018',
      LatestDelivery:'2/9/2018',
      Status: 'Close'
    }
  ];
  this.invoiceData = [
    {
      mode : 1,
      InvoiceNo : '111-222-333',
      InvoiceDate : '2/9/2018',
      Amount:500
    },{
      mode : 1,
      InvoiceNo : '111-222-333',
      InvoiceDate : '2/9/2018',
      Amount:200
    },{
      mode : 1,
      InvoiceNo : '111-222-333',
      InvoiceDate : '2/9/2018',
      Amount:-100
    },{
      mode : 1,
      InvoiceNo : '111-222-333',
      InvoiceDate : '2/9/2018',
      Amount:250
    },{
      mode : 1,
      InvoiceNo : '111-222-333',
      InvoiceDate : '2/9/2018',
      Amount:400
    }
  ];  
  }
  goToPage(pagename){
    this.router.navigateByUrl('/'+pagename);
  }
  
}
