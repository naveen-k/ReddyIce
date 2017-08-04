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

    source: LocalDataSource = new LocalDataSource();
    constructor(private service: ReconciliationService) {
        this.service.getData().then((data) => {
            this.source.load(data);
        });
    }

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.location.length;
    }

}
