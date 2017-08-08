import { LocalDataSource } from 'ng2-smart-table';
import { ReconciliationService } from '../../reconciliation.service';
import { Component } from '@angular/core';

@Component({
    templateUrl: './reconciliation.component.html',
    styleUrls: ['./reconciliation.component.scss'],
})
export class ReconciliationComponent {
    isNewCustomer: boolean = true;

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
            delete: false ,
        },
        hideSubHeader : true,
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true,
        },
        editable: false,
        columns: {
            routename: {
                title: 'Route Number',
                type: 'number',
            },
            location: {
                title: 'Location/Branch',
                type: 'string',
            },
            ticketno: {
                title: '# of Tickets',
                type: 'number',
            },
            amount: {
                title: 'Amount',
                type: 'number',
            },
        },
    };

     settings2 = {
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
            delete: false ,
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true,
        },
        editable: false,
        columns: {
            product: {
                title: 'Product',
                type: 'number',
            },
            load: {
                title: 'Load',
                type: 'string',
            },
            return: {
                title: 'Return',
                type: 'number',
            },
            damage: {
                title: 'Damage',
                type: 'number',
            },
             sale: {
                title: 'Sale',
                type: 'number',
            },
             over: {
                title: 'Over/Short',
                type: 'number',
            },
        },
    };

     settings3 = {
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
            delete: false ,
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true,
        },
        editable: false,
        columns: {
            custNumber: {
                title: 'Customer Number',
                type: 'number',
            },
            customer: {
                title: 'Customer Name',
                type: 'string',
            },
            ticket: {
                title: 'Ticket',
                type: 'number',
            },
             invoiceAmount: {
                title: 'Invoice Amount',
                type: 'number',
            },
             check: {
                title: 'Check',
                type: 'number',
            },
             cash: {
                title: 'Cash',
                type: 'number',
            },
             charge: {
                title: 'Charge',
                type: 'number',
            },
        },
    };

    source: LocalDataSource = new LocalDataSource();
    source2: LocalDataSource = new LocalDataSource();
    source3: LocalDataSource = new LocalDataSource();
    constructor(private service: ReconciliationService) {
        this.service.getData().then((data) => {
            this.source.load(data);
        });
         this.service.getData2().then((data) => {
            this.source2.load(data);
        });
         this.service.getData3().then((data) => {
            this.source3.load(data);
        });
    }

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.location.length;
    }

}
