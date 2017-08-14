import { UserService } from '../../../../shared/user.service';
import { selector } from 'rxjs/operator/multicast';
import { LocalDataSource } from 'ng2-smart-table';
import { UserManagementService } from '../../user-management.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
    selector: 'create-user',
})
export class CreateUserComponent implements OnInit {
    @Input() user: any;
    @Input() isNewUser: boolean;
    @Output() onSaveUser: EventEmitter<any> = new EventEmitter();
    @Output() closeNewUser: EventEmitter<any> = new EventEmitter();

    roles: any[] = [];

    distributorsAndCopackers: any[] = [];

    constructor(private umService: UserManagementService) { }

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }
    onSubmit() {
        // this.user.id = Math.random();
        this.onSaveUser.emit(this.user);
    }
    OnCancelClick() {
        this.closeNewUser.emit();
    }

    ngOnInit() {
        this.umService.getRoles().subscribe((response) => {            
            this.roles = response;
        });

        this.umService.getDistributerAndCopacker().subscribe((response) => {            
            this.distributorsAndCopackers = response;
        });
    }
}
