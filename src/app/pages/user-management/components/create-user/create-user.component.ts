import { UserService } from '../../../../shared/user.service';
import { selector } from 'rxjs/operator/multicast';
import { LocalDataSource } from 'ng2-smart-table';
import { UserManagementService } from '../../user-management.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../user-management.interface';
import { any } from 'codelyzer/util/function';

@Component({
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
    selector: 'create-user',
})
export class CreateUserComponent implements OnInit {

    private _roles: any[];

    @Input() user: any;
    @Input() isNewUser: boolean;
    @Input()
    get roles(): any {
        return this._roles;
    }
    set roles(values) {
        if (!values) { return; }
        this._roles = values;
        this.filterRoles();
    }
    @Input()
    get action(): any {
        return this;
    }
    set action(values) {
        if (values === '') { return; }
        this.actionName = values;
        console.log(values);
    }

    @Input() branches: any;
    @Input() userDetails: any;
    @Input() distributorsAndCopackers: any;
    @Input() isDistributorAdmin: boolean;
    @Output() onSaveUser: EventEmitter<any> = new EventEmitter();
    @Output() onUpdateUser: EventEmitter<any> = new EventEmitter();
    @Output() closeNewUser: EventEmitter<any> = new EventEmitter();

    @Output() formChanged = new EventEmitter();

    actionName: string;
    riUserList: any = [];
    riUserName: string = '';
    searchedUsers: any;
    showList: boolean = false;
    selectedSearchUser: boolean = false;
    timeOut: any;
    roleList: any = [];
    userObject: any = [];
    roleNameAllowed: boolean = true;
    isEmailExist: boolean = false;

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
        this.selectedSearchUser = true;
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
        this.userObject = this.userService.getUser();
        console.log(this.userObject.Role.RoleName);
        console.log(this.user);
        // this.userDetails = this.userService.getUser() || {};
        if (this.isNewUser) {
            this.user.RoleID = this.roles ? this.roles[0].RoleID : '';
            if (!this.isDistributorAdmin) {
                this.user.DistributorMasterID = this.distributorsAndCopackers ? this.distributorsAndCopackers[0].DistributorCopackerID : '';
            }
            this.user.BranchID = this.branches ? this.branches[0].BranchID : '';
        }
        // this.roles = this.roles.filter((role) => role.ShowExternal);
        // this.roleList = this.roles.reduce((accumulator, child) => {
        //   if (child.ShowExternal) {
        //     return [
        //       ...accumulator,
        //       child,
        //     ];
        //   }
        //   return accumulator;
        // }, []);        
    }

    filterRoles() {
        this.roleList = this.roles.reduce((accumulator, child) => {
            if (child.ShowExternal) {
                return [
                    ...accumulator,
                    child,
                ];
            }
            return accumulator;
        }, []);
    }

    changeHandler() {
        if (this.user.IsRIInternal) {
            this.roleList = this.roles;
        } else if (!this.user.IsRIInternal) {
            this.riUserName = '';
            this.roleList = this.roles.reduce((accumulator, child) => {
                if (child.ShowExternal) {
                    return [
                        ...accumulator,
                        child,
                    ];
                }
                return accumulator;
            }, []);
            if (this.selectedSearchUser) {
                this.user = <User>{
                    FirstName: '',
                    LastName: '',
                    UserName: '',
                    EmailID: '',
                    BranchID: '',
                    Phone: '',
                    role: '',
                    IsActive: true,
                    IsSeasonal: true,
                    IsRIInternal: false,
                };
                this.selectedSearchUser = false;
            }

        }
        this.formChanged.emit('changed');
    }

    resetUser() {
        this.user = {};
    }
    checkEmail(email) {
        console.log(email);
        this.userService.isUserExist(email).subscribe((res) => {
            console.log(res);
            if (res.Message === 'Email already exists') {

                this.isEmailExist = true;
            }
            else {

                this.isEmailExist = false;
            }

        }, (err) => {

        });
    }
    rolChange(roleID) {
        if (roleID == 1 || roleID == 2) {
            if (this.branches[0].BranchID != 'All') { this.branches.unshift({ BranchID: '', BranchName: 'All' }) }
            //else { }
            this.user.BranchID = '';
        }
        else{
             if (this.branches[0].BranchID == '') { this.branches.shift() };
           
        }

    }
}
