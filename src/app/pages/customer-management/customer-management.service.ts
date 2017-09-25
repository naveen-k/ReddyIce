import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { UserService } from '../../shared/user.service';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CustomerManagementService extends SharedService {

  constructor(
    protected http: HttpService,
    private userService: UserService,
  ) {
    super(http);
  }

  getAllCustomers() {
    return this.http.get(`api/customer/getexternalcustomer`)
      .map((res) => res.json()).map((res) => {
        return res;
      });

  }
  getCustomer(customerid) {
    return this.http.get(`api/customer/getcustomerdetailbyid?customerid=${customerid}`)
      .map((res) => res.json()).map((res) => {
        return res;
      });

  }

  getExternalProducts() {
    return this.http.get(`api/customer/getexternalproductlist`)
      .map((res) => res.json());
  }
  setGenericPrice(data) {
    return this.http.post(`api/setgenricpriceforexternalcustomer`, data)
      .map((res) => res.json());
  }
  deleteCustomer(data) {
    return this.http.delete('api/deleteexternalcustomer', data).map((res => res.json()));
  }
  createCustomer(data) {
    return this.http.post('api/createexternalcustomer', data).map((res => res.json()));
  }
  updateCustomer(custId, data) {
    return this.http.put(`api/editexternalcustomer?id=${custId}`, data).map((res => res.json()));
  }

  isProductExist(productname) {
    return this.http.get(`api/customer/IsProductExistByName?productname=${productname}`).map((res => res.json()));
  }
}
