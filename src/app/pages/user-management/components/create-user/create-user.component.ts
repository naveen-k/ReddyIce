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
    @Input() roles: any;
    @Input() branches: any;
    @Input() userDetails: any;
    @Input() distributorsAndCopackers: any;
    @Input() isDistributorAdmin: boolean;
    @Output() onSaveUser: EventEmitter<any> = new EventEmitter();
    @Output() onUpdateUser: EventEmitter<any> = new EventEmitter();
    @Output() closeNewUser: EventEmitter<any> = new EventEmitter();

    @Output() formChanged = new EventEmitter();

    riUserList: any = [];
    riUserName: string = '';
    searchedUsers: any;
    showList: boolean = false;
    timeOut: any;
    constructor(private umService: UserManagementService, private userService: UserService) { }

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }
    searchUserHandler(user) {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
            this.timeOut = null;
        }
        this.searchedUsers = {};
        this.riUserList = [];
        if (!user) { return; }
        this.timeOut = setTimeout(() => {
            this.umService.searchInternalUsers(user).subscribe((res) => {
                this.searchedUsers = res;
                this.riUserList = Object.keys(res);
                this.showList = true;
            }, (err) => {
                this.riUserList.push('No data found');
            });
        }, 1000);
    }

    userSelected(_user) {
        this.showList = false;
        const user = this.searchedUsers[_user];
        if (!user) { return; }
        this.user.FirstName = user.displayname[0].split(' ')[0] || '';
        this.user.LastName = user.displayname[0].split(' ')[1] || '';
        this.user.UserName = user.cn[0] || '';
        this.user.EmailID = user.mail[0] || '';
        this.riUserName = _user;
    }

    onSubmit() {
        // If user is RI internal user then distributor ID should be set to empty
        if (this.userDetails.IsDistributor) {
            this.user.DistributorMasterID = this.userDetails.Distributor.DistributorMasterId;
        } else if (this.user.IsRIInternal) {
            this.user.DistributorMasterID = '';
        }
        this.isNewUser ? this.onSaveUser.emit(this.user) : this.onUpdateUser.emit(this.user);
    }
    OnCancelClick() {


    }

    ngOnInit() {
        // this.userDetails = this.userService.getUser() || {};
        if (this.isNewUser) {
            this.user.RoleID = this.roles ? this.roles[0].RoleID : '';
            if (!this.isDistributorAdmin) {
                //  this.user.DistributorMasterID = this.distributorsAndCopackers ? this.distributorsAndCopackers[0].DistributorCopackerID : '';
            }
            // this.user.BranchID = this.branches ? this.branches[0].BranchID : '';
        }
    }

    changeHandler() {
        this.formChanged.emit('changed');
    }

    resetUser() {
        this.user = {};
    }
}
