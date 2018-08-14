import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { UserService } from '../../shared/user.service';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
import { CacheService } from 'app/shared/cache.service';

@Injectable()
export class CustomerManagementService extends SharedService {

  constructor(
    protected http: HttpService,
    private userService: UserService,
    protected cache: CacheService
  ) {
    super(http, cache);
  }

  getAllCustomers() {
    return this.http.get(`api/customer/getexternalcustomer`)
      .map((res) => res.json()).map((res) => {
        return res;
      });

  }
  getCustomer(customerid, isReddyIce=0) {
    return this.http.get(`api/customer/getcustomerdetailbyid?customerid=${customerid}&isRI=${isReddyIce}`)
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
    const options = new RequestOptions({
      body: data,
    });
    return this.http.delete('api/deleteexternalcustomer', options).map((res => res.json()));
  }
  createCustomer(data) {
	  console.log(data);
    return this.http.post('api/createexternalcustomer', data).map((res => res.json()));
  }
  updateCustomer(custId, data) {
    return this.http.put(`api/editexternalcustomer?id=${custId}`, data).map((res => res.json()));
  }

  isProductExist(productname) {
    return this.http.get(`api/customer/IsProductExistByName?ms-productname=${productname}`).map((res => res.json()));
  }
  getAllStates() {
    return this.http.get(`api/customer/getstates`)
      .map((res) => res.json());
  }
  isCustomerNumberExist(CustomerNumber) {
    return this.http.get(`api/customer/iscustnoexist?CustomerNumber=${CustomerNumber}`).map((res => res.json()));
  }
  getChain() {
    return this.http.get(`api/customer/getchain`)
      .map((res) => res.json());
  }
  deleteProduct(productId, status) {
    return this.http.delete(`api/deleteexternalproduct?productId=${productId}&status=${status}`)
      .map((res) => res.json());
  }
}
