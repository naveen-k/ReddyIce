import { Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http.service';
import { Observable } from 'rxjs/Rx';
import { User } from './user-management.interface';

@Injectable()
export class UserTablesService {
    constructor(private http: HttpService) { }

    getUsers(): Observable<User[]> {
        return this.http.get('api/user/GetUsersList').map((res) => res.json());
    }

    createUser(data): Observable<Response> {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const options = new RequestOptions({ 'headers': headers });
      return this.http.post('api/user/CreateUser', data, options).map((res => res.json()));
    }

    dataTableData = [{
        'id': 1,
        'fname': 'Wing',
        'lname': 'vella',
        'username': 'wingvella',
        'email': 'tellus.eu.augue@arcu.com',
        'regDate': '2016-01-09T14:48:34-08:00',
        'city': 'Paglieta',
        'age': 25,
        'role': 'Admin',
        'avaialbleRoles': ['Admin', 'Driver'],
        'location': 'NY',
        'branch': '301',
        'availableBranches': ['301', '301', '303', '304', '305'],
        'phone': '9976746873',
        'isRiInternal': true,
        'isActive': true,
        'availableDistributor': ['Dist-001', 'Dist-002'],
        'distributor': '',
        'isSeasonal': false,
    },
    {
        'id': 2,
        'fname': 'Martin',
        'lname': 'tom',
        'username': 'martin225',
        'email': 'sed.dictum@Donec.org',
        'regDate': '2017-01-23T20:09:52-08:00',
        'city': 'Bear',
        'age': 32,
        'role': 'Admin',
        'avaialbleRoles': ['Admin', 'Driver'],
        'location': 'Australia',
        'branch': '302',
        'availableBranches': ['301', '301', '303', '304', '305'],
        'phone': '9956446872',
        'isRiInternal': true,
        'isActive': true,
        'availableDistributor': ['Dist-001', 'Dist-002'],
        'distributor': '',
        'isSeasonal': false,
    },
    {
        'id': 3,
        'fname': 'Williams',
        'lname': 'genius',
        'username': 'williamsg',
        'email': 'mauris@Craslorem.ca',
        'regDate': '2015-11-19T19:11:33-08:00',
        'city': 'Bruderheim',
        'age': 31,
        'role': 'Admin',
        'avaialbleRoles': ['Admin', 'Driver'],
        'location': 'Austria',
        'branch': '303',
        'availableBranches': ['301', '301', '303', '304', '305'],
        'phone': '9933246871',
        'isRiInternal': true,
        'isActive': true,
        'availableDistributor': ['Dist-001', 'Dist-002'],
        'distributor': '',
        'isSeasonal': false,
    },
    {
        'id': 4,
        'fname': 'James',
        'lname': 'phil',
        'username': 'jamesphil2',
        'email': 'mi.Aliquam@Phasellus.net',
        'regDate': '2015-11-02T07:59:34-08:00',
        'city': 'Andenne',
        'age': 50,
        'role': 'Admin',
        'avaialbleRoles': ['Admin', 'Driver'],
        'location': 'Andenne',
        'branch': '304',
        'availableBranches': ['301', '301', '303', '304', '305'],
        'phone': '9988746870',
        'isRiInternal': true,
        'isActive': true,
        'availableDistributor': ['Dist-001', 'Dist-002'],
        'distributor': '',
        'isSeasonal': false,
    },
    {
        'id': 5,
        'fname': 'Mark',
        'lname': 'tiny',
        'username': 'mktiny',
        'email': 'ligula@acorciUt.edu',
        'regDate': '2017-02-25T15:42:17-08:00',
        'city': 'HomprŽ',
        'age': 24,
        'role': 'Admin',
        'avaialbleRoles': ['Admin', 'Driver'],
        'location': 'Canada',
        'branch': '305',
        'availableBranches': ['301', '301', '303', '304', '305'],
        'phone': '9989766875',
        'isRiInternal': false,
        'isActive': true,
        'availableDistributor': ['Dist-001', 'Dist-002'],
        'distributor': 'Dist-001',
        'isSeasonal': true,
    },
    {
        'id': 6,
        'fname': 'Louis',
        'lname': 'venom',
        'username': 'louisven',
        'email': 'Nunc.commodo@justo.org',
        'regDate': '2016-03-07T03:47:55-08:00',
        'city': 'Ried im Innkreis',
        'age': 23,
        'role': 'Admin',
        'avaialbleRoles': ['Admin', 'Driver'],
        'location': 'Washington',
        'branch': '304',
        'availableBranches': ['301', '301', '303', '304', '305'],
        'phone': '9934246870',
        'isRiInternal': true,
        'isActive': true,
        'availableDistributor': ['Dist-001', 'Dist-002'],
        'distributor': '',
        'isSeasonal': false,
    },
    {
        'id': 7,
        'fname': 'Heman',
        'lname': 'tailor',
        'username': 'hemontailor',
        'email': 'augue@penatibuset.net',
        'regDate': '2017-02-27T20:03:50-08:00',
        'city': 'Cwmbran',
        'age': 45,
        'role': 'Admin',
        'avaialbleRoles': ['Admin', 'Driver'],
        'location': 'LA',
        'branch': '305',
        'availableBranches': ['301', '301', '303', '304', '305'],
        'phone': '9925954687',
        'isRiInternal': false,
        'isActive': true,
        'availableDistributor': ['Dist-001', 'Dist-002'],
        'distributor': 'Dist-002',
        'isSeasonal': false,
    },

    ];

    getData(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.dataTableData);
            }, 2000);
        });
    }
}
