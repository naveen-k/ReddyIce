import { selector } from 'rxjs/operator/multicast';
import { LocalDataSource } from 'ng2-smart-table';
import { UserTablesService } from '../../user-management.service';
import { Component, Input } from '@angular/core';

@Component({
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
    selector: 'create-user',
})
export class CreateUserComponent {
    @Input() user: any;
OnCancelClick() {
    this.user = {};
}
    settings = {
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
        editable: false,
        columns: {
            city: {
                title: 'Location',
                type: 'number',
            },
            branch: {
                title: 'Branch',
                type: 'string',
            },

        },
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
