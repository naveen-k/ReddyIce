import { CustomerManagementService } from '../../customer-management.service';

import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
    templateUrl: './customer-management.component.html',
    styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent {
    selectedUser = {};
    settings1 = {
        mode: 'external',
        add: {
            addButtonContent: '',
        },
        actions: {
            delete: false,
        },
        hideSubHeader : true,
        edit: {
            editButtonContent: '<i class="ion-edit"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true,
        },
        columns: {
            customerNumber: {
                title: 'Customer#',
                type: 'number',
            },
            customerName: {
                title: 'Name',
                type: 'string',
            },
            isRICustomer: {
                title: 'IsReddyIce?',
                type: 'string',
            },
        },
    };

    settings2 = {
        add: {
            addButtonContent: '',
        },
        edit: {
            editButtonContent: '<i class="ion-edit"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true,
        },
        columns: {
            name: {
                title: 'Products',
                type: 'string',
            },
        },
    };

    settings3 = {
        add: {
            addButtonContent: '',
        },
        edit: {
            editButtonContent: '<i class="ion-edit"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true,
        },
        columns: {
            name: {
                title: 'Products',
                type: 'string',
            },
        },
    };

    source1: LocalDataSource = new LocalDataSource();
    source2: LocalDataSource = new LocalDataSource();
    source3: LocalDataSource = new LocalDataSource();

    constructor(protected service: CustomerManagementService) {
        this.service.getData().then((data) => {
            this.source1.load(data);
        });
        this.service.getProducts().then((data) => {
            this.source2.load(data);
        });
        this.service.mappedProducts().then((data) => {
            this.source3.load(data);
        });
    }
    isNewCustomer: boolean = true;

    showNewCustomer(newCustomer) {
        // this.isNewCustomer = newCustomer;
        this.isNewCustomer = !this.isNewCustomer;
    }

    onEditCliked(event) {        
        this.selectedUser = event.data;        
    }
}
