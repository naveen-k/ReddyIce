import { LocalDataSource } from 'ng2-smart-table';
import { UserService } from '../../../../shared/user.service';
import { UserManagementService } from '../../user-management.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { User } from '../../user-management.interface';

import { NotificationsService } from 'angular2-notifications';

@Component({
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
    rightCardOpen: boolean = false;
    isNewUser: boolean = false;
    selectedUser = {};
    newUser: any;
    hideColumn: boolean = false;
    cardTitle: string;
    userDetails: any;
    showNewCustomer(newCustomer) {
        this.rightCardOpen = !this.rightCardOpen;
        this.isNewUser = true;
        this.hideColumn = !this.hideColumn;
        this.cardTitle = 'Create New User';
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
    closeRightCard() {
      this.rightCardOpen = !this.rightCardOpen;
      this.isNewUser = false;
      this.hideColumn = !this.hideColumn;
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize(event) {
      if (event.target.innerWidth > 1010) {
        this.hideColumn = false;
      }else if (event.target.innerWidth > 778 && event.target.innerWidth < 1010) {
          this.hideColumn = true;
      }
    }

    userTableData: User[];
    constructor(private service: UserManagementService, private notification: NotificationsService, private userService: UserService) {}

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }

    onEditClicked(user) {
        this.newUser = user;
        this.cardTitle = 'Edit User';
        this.isNewUser = false;
        if (!this.rightCardOpen) {
          this.rightCardOpen = !this.rightCardOpen;
          this.hideColumn = !this.hideColumn;
        }
    }

    onSaveUser(user) {
        this.service.createUser(user).subscribe((res) => {
            this.notification.success('Success', 'User created successfully');
        });
        this.rightCardOpen = !this.rightCardOpen;
        this.hideColumn = !this.hideColumn;
        this.isNewUser = false;
        this.userTableData.push(user);
    }

    ngOnInit() {
        this.userDetails = this.userService.getUser();
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
