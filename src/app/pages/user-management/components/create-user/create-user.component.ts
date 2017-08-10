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
    @Input() isNewUser: boolean;
    @Output() onSaveUser: EventEmitter<any> = new EventEmitter();
    @Output() closeNewUser: EventEmitter<any> = new EventEmitter();

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }
    onSubmit () {
      this.user.id = Math.random();
      this.onSaveUser.emit(this.user);
    }
    OnCancelClick() {
        this.closeNewUser.emit();
    }

}
