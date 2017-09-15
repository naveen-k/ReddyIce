import { Customer } from '../../shared/interfaces/interfaces';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpService } from '../../shared/http.service';
import { SharedService } from '../../shared/shared.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class TrackerService extends SharedService {

  constructor(protected http: HttpService) {
    super(http);
  }
}
