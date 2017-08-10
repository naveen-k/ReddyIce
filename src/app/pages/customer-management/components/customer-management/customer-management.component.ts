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
            //    show: true,
            },
            customerName: {
                title: 'Name',
                type: 'string',
            //    show: true,
            },
            isRICustomer: {
                title: 'IsReddyIce?',
                type: 'string',
            //    show: true,
            },
            email: {
                title: 'Email',
                type: 'string',
            //    show: true,
            },
            contact: {
                title: 'Contact Number',
                type: 'number',
            //    show: true,
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

    smartTableData: any;
    products: any;
    mappedProds: any;

    constructor(protected service: CustomerManagementService) {
        // this.service.getData().then((data) => {
        //     this.source1.load(data);
        // });
        // this.service.getProducts().then((data) => {
        //     this.source2.load(data);
        // });
        // this.service.mappedProducts().then((data) => {
        //     this.source3.load(data);
        // });
        this.smartTableData = service.smartTableData;
        this.products = service.products;
        this.mappedProds = service.mappedProds;
    }
    isNewCustomer: boolean = true;
    setPrice: boolean = false;

    showNewCustomer(newCustomer) {
        this.isNewCustomer = !this.isNewCustomer;
        // this.setPrice = !this.setPrice;
    }
    showPrice() {
        // this.isNewCustomer = !this.isNewCustomer;
        this.setPrice = !this.setPrice;
    }

    onEditCliked(event) {        
        this.selectedUser = event.data;        
    }
}
