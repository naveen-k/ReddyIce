import { CustomerManagementService } from '../../customer-management.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/user.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.scss'],
})

export class CreateCustomerComponent implements OnInit {

    constructor(protected service: CustomerManagementService) {
        this.mappedProds = service.mappedProds;
        this.products = service.products;
    }

    ngOnInit() { }


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
    source3: LocalDataSource = new LocalDataSource();
    smartTableData: any;
    products: any;
    mappedProds: any;
    isNewCustomer: boolean = false;
    setPrice: boolean = false;
    customerObj: any = {};

   
    showNewCustomer(newCustomer) {
        this.isNewCustomer = !this.isNewCustomer;
        this.setPrice = false;
    }
    showPrice() {
        this.setPrice = !this.setPrice;
        this.isNewCustomer = false;
    }

}