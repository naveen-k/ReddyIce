import { selector } from 'rxjs/operator/multicast';
import { LocalDataSource } from 'ng2-smart-table';
import { UserTablesService } from '../../user-management.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
    selector: 'create-user',
})
export class CreateUserComponent {
    @Input() user: any;
    @Output() onSaveUser: EventEmitter<any> = new EventEmitter();
    @Output() closeNewUser: EventEmitter<any> = new EventEmitter();

    roles = ['Admin', 'Driver'];
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
    isChecked: boolean = false;

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
    onSubmit () {
      this.user.isActive = this.isChecked;
      this.user.id = 9
      this.user.name = `${this.user.fname} ${this.user.lname}`;
      this.onSaveUser.emit(this.user);
      this.user = {};
    }
    OnCancelClick() {
        this.user = {};
        this.closeNewUser.emit();
    }

}
