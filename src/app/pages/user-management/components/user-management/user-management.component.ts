import { LocalDataSource } from 'ng2-smart-table';
import { UserManagementService } from '../../user-management.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { User } from '../../user-management.interface';

import { NotificationsService } from 'angular2-notifications';

@Component({
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
    isNewCustomer: boolean = false;
    selectedUser = {};
    newUser: any;
    hideColumn: boolean = false;
    showNewCustomer(newCustomer) {        
        this.isNewCustomer = !this.isNewCustomer;
        this.hideColumn = !this.hideColumn;
        this.newUser = <User>{
            FirstName: '',
            LastName: '',
            UserName: '',
            EmailID: '',
            Phone: '',
            role: '',
            branch: '305',
            IsActive: false,
            availableBranches: ['301', '301', '303', '304', '305'],            
            isSeasonal: true,
            isRiInternal: false,
        };
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize(event) {
        if (event.target.innerWidth > 778 && event.target.innerWidth < 1010) {            
            this.hideColumn = true;
        }
    }
    
    userTableData: User[];
    constructor(private service: UserManagementService, private notification: NotificationsService) {}

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }

    onEditCliked($event) {
        this.selectedUser = $event.data;
    }

    onSaveUser(user) {        
        this.service.createUser(user).subscribe((res) => {            
            this.notification.success('Success', 'User created successfully');
        });
        this.userTableData.push(user);
        this.isNewCustomer = !this.isNewCustomer;
    }

    ngOnInit() {
        this.service.getUsers().subscribe((res) => {
            res.forEach((user, index) => {
                user.id = index;
            });
            this.userTableData = res;
        });
    }

    trackByTable(i, item) {
        return item ? item.id : undefined;
    }

}
