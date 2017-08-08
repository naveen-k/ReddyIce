import { LocalDataSource } from 'ng2-smart-table';
import { UserTablesService } from '../../user-management.service';
import { Component } from '@angular/core';

@Component({
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
    isNewCustomer: boolean = true;
    selectedUser = {};
    showNewCustomer(newCustomer) {
        this.isNewCustomer = newCustomer;
    }

    settings = {
        mode: 'external',
        add: {
            addButtonContent: '',
        },
        edit: {
            editButtonContent: '<i class="ion-edit"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmEdit: true,
        },
        actions: {
            delete: false,
        },
        hideSubHeader : true,
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true,
        },
        editable: false,
        columns: {
            name: {
                title: 'Name',
                type: 'string',
            },
            role: {
                title: 'Role',
                type: 'string',
            },

        }
    };

    source: LocalDataSource = new LocalDataSource();
    constructor(private service: UserTablesService) {
        this.service.getData().then((data) => {
            data.forEach(element => {
                element['name'] = `${element.fname} ${element.lname}`;
            });
            this.source.load(data);
        });
    }

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }

    onEditCliked($event) {        
        this.selectedUser = $event.data;
    }

}
