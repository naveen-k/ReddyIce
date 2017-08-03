import { Injectable } from '@angular/core';

@Injectable()
export class UserTablesService {

    dataTableData = [{
        'id': 1,
        'name': 'Wing',
        'email': 'tellus.eu.augue@arcu.com',
        'regDate': '2016-01-09T14:48:34-08:00',
        'city': 'Paglieta',
        'age': 25
    },
    {
        'id': 2,
        'name': 'Whitney',
        'email': 'sed.dictum@Donec.org',
        'regDate': '2017-01-23T20:09:52-08:00',
        'city': 'Bear',
        'age': 32
    },
    {
        'id': 3,
        'name': 'Oliver',
        'email': 'mauris@Craslorem.ca',
        'regDate': '2015-11-19T19:11:33-08:00',
        'city': 'Bruderheim',
        'age': 31
    },
    {
        'id': 4,
        'name': 'Vladimir',
        'email': 'mi.Aliquam@Phasellus.net',
        'regDate': '2015-11-02T07:59:34-08:00',
        'city': 'Andenne',
        'age': 50
    },
    {
        'id': 5,
        'name': 'Maggy',
        'email': 'ligula@acorciUt.edu',
        'regDate': '2017-02-25T15:42:17-08:00',
        'city': 'HomprŽ',
        'age': 24
    },
    {
        'id': 6,
        'name': 'Unity',
        'email': 'Nunc.commodo@justo.org',
        'regDate': '2016-03-07T03:47:55-08:00',
        'city': 'Ried im Innkreis',
        'age': 23
    },
    {
        'id': 7,
        'name': 'Ralph',
        'email': 'augue@penatibuset.net',
        'regDate': '2017-02-27T20:03:50-08:00',
        'city': 'Cwmbran',
        'age': 45
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
