import {Component} from '@angular/core';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  showDetails: boolean = false;
  constructor() {
  }
  selectedCustomer(showCustomerDetail) {
    console.log(showCustomerDetail);
    this.showDetails = showCustomerDetail;
  }
}
