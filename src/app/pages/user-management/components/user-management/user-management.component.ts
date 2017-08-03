import { LocalDataSource } from 'ng2-smart-table';
import { UserTablesService } from '../../user-management.service';
import { Component } from '@angular/core';

@Component({
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
    
    settings = {
        add: {
            addButtonContent: '<i class="ion-ios-plus-outline"></i>',
            createButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        edit: {
            editButtonContent: '<i class="ion-edit"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true
        },
        editable: false,
        columns: {
            id: {
                title: 'ID',
                type: 'number',
            },
            name: {
                title: 'Name',
                type: 'string'
            },
            email: {
                title: 'Email',
                type: 'string'
            },
            regDate: {
                title: 'Reg date',
                type: 'date'
            },
            age: {
                title: 'Age',
                type: 'number'
            },
            city: {
                title: 'City',
                type: 'string'
            }
        }
    };

    source: LocalDataSource = new LocalDataSource();
    constructor(private service: UserTablesService) {
        this.service.getData().then((data) => {
            this.source.load(data);
        });
    }

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }

}
