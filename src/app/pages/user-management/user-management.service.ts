import { Injectable } from '@angular/core';

@Injectable()
export class UserTablesService {

    dataTableData = [{
        'id': 1,
        'fname': 'Wing',
        'lname': 'vella',
        'email': 'tellus.eu.augue@arcu.com',
        'regDate': '2016-01-09T14:48:34-08:00',
        'city': 'Paglieta',
        'age': 25,
        'role':'Admin',
        'location':'NY',
        'branch':'301',
        'phone':'997674687',
        'riinternal': 'Y',
    },
    {
        'id': 2,
        'fname': 'Martin',
        'lname': 'tom',
        'email': 'sed.dictum@Donec.org',
        'regDate': '2017-01-23T20:09:52-08:00',
        'city': 'Bear',
        'age': 32,
        'role':'Admin',
        'location':'Australia',
        'branch':'302',
        'phone':'995644687',
        'riinternal': 'Y',
    },
    {
        'id': 3,
        'fname': 'Williams',
        'lname': 'genius',
        'email': 'mauris@Craslorem.ca',
        'regDate': '2015-11-19T19:11:33-08:00',
        'city': 'Bruderheim',
        'age': 31,
        'role':'Admin',
        'location':'Austria',
        'branch':'303',
        'phone':'993324687',
        'riinternal': 'Y',
    },
    {
        'id': 4,
        'fname': 'James',
        'lname': 'phil',
        'email': 'mi.Aliquam@Phasellus.net',
        'regDate': '2015-11-02T07:59:34-08:00',
        'city': 'Andenne',
        'age': 50,
        'role':'Admin',
        'location':'Andenne',
        'branch':'304',
        'phone':'998874687',
        'riinternal': 'Y',
    },
    {
        'id': 5,
        'fname': 'Mark',
        'lname': 'tiny',
        'email': 'ligula@acorciUt.edu',
        'regDate': '2017-02-25T15:42:17-08:00',
        'city': 'HomprŽ',
        'age': 24,
        'role':'Admin',
        'location':'Canada',
        'branch':'305',
        'phone':'998976687',
        'riinternal': 'N',
    },
    {
        'id': 6,
        'fname': 'Louis',
        'lname': 'venom',
        'email': 'Nunc.commodo@justo.org',
        'regDate': '2016-03-07T03:47:55-08:00',
        'city': 'Ried im Innkreis',
        'age': 23,
        'role':'Admin',
        'location':'Washington',
        'branch':'306',
        'phone':'993424687',
        'riinternal': 'Y',
    },
    {
        'id': 7,
        'fname': 'Heman',
        'lname': 'tailor',
        'email': 'augue@penatibuset.net',
        'regDate': '2017-02-27T20:03:50-08:00',
        'city': 'Cwmbran',
        'age': 45,
        'role':'Admin',
        'location':'LA',
        'branch':'307',
        'phone':'9925954687',
        'riinternal': 'N',
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
