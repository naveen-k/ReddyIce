import { CustomerManagementService } from '../../customer-management.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { UserService } from '../../../../shared/user.service';

@Component({
    templateUrl: './customer-management.component.html',
    styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent implements OnInit {

    customers: any = [];
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

    ngOnInit() {
        this.getAllCustomers();
    }
  

    getAllCustomers() {
        this.service.getAllCustomers().subscribe((res) => {
            this.customers = res;
            console.log(this.customers);
        }, (err) => {
            console.log(err);
        });
    }

    selectedUser = {};
    settings1 = {
        mode: 'external',
        add: {
            addButtonContent: '',
        },
        actions: {
            delete: false,
        },
        hideSubHeader: true,
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
            isRiCustomer: {
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

    onEditCliked(event) {
        this.selectedUser = event.data;
    }
}
