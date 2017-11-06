import { forEach } from '@angular/router/src/utils/collection';
import { NotificationsService } from 'angular2-notifications';
import { UserService } from '../../../../shared/user.service';
import { selector } from 'rxjs/operator/multicast';
import { LocalDataSource } from 'ng2-smart-table';
import { UserManagementService } from '../../user-management.service';
import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../user-management.interface';
import { any } from 'codelyzer/util/function';

@Component({
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
    selector: 'create-user',
})
export class CreateUserComponent implements OnInit, AfterContentInit {

    private _roles: any[];
    private _user: any = {};
    userBranch: any;
    tBranches: any = [];
    actionName: string;
    riUserList: any = [];
    riUserName: string = '';
    searchedUsers: any;
    showList: boolean = false;
    showIseries: boolean = false;
    selectedSearchUser: boolean = false;
    timeOut: any;
    roleList: any = [];
    userObject: any = {};
    roleNameAllowed: boolean = true;
    isEmailExist: boolean = false;
    isFormValid: boolean = true;
    searching: boolean = false;
    cBranches: any = [];
    branchList: any = [];
    addedBranches: any = [];
    tempUserBranch: any = [];
    @Input()
    get user(): any {
        return this._user;
    }
    set user(val: any) {
        if (!Object.keys(val).length) {
            return;
        }
        debugger;
        // to empty the role field if discard or back button is clicked without saving data.
        this._user = val;
        this.populatateRoleList();
        if (this.action == 'edit') {
            val.RoleID = val.RoleID || this._user.RoleID;
            this.roleChange(val.RoleID);
        }
        
        this.loadBranches();
        this._user.IsSeasonal = this.isDistributorSeasonal();
        if (this.tempUserBranch) { this.tempUserBranch.length = 0; }
        this.tempUserBranch = [];
        if (this.user.Branch) {
            this.tempUserBranch = this.user.Branch.slice();
        }

        let role = val.RoleID + '';
        if (role === '1' || role === '2' || role === '4' || role === '5') {
            this.user.Branch = [{ BranchCode: 1, BranchID: 1, BranchName: "All Branches", IsActive: true }];
            this.userBranch = [1];
        }
        else {
            this.addedBranches = this.user.Branch;
            var i: number = 0;
            if (this.userBranch) { this.userBranch.length = 0; }

            this.userBranch = [];

            if (this.user.Branch) {
                for (i = 0; i < this.user.Branch.length; i++)
                    if (this.user.Branch[i].IsActive === true) {
                        this.userBranch.push(this.user.Branch[i].BranchID);
                    }
            }
        }
    }

    @Input() isNewUser: boolean;
    @Input() formIsDirty: boolean;
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
        if (values == 'create') {
            this.user.IsActive = true;
        }
        if (values == 'edit') {
            this.isFormValid = true;
        }
    }

    @Input()
    set mIOpen(val: boolean) {
        if (!val) { this.clearInternalUserSearch(); }
    }

    @Input() branches: any;
    @Input() userDetails: any;
    @Input() distributorsAndCopackers: any;
    @Input() isDistributorAdmin: boolean;
    @Output() onSaveUser: EventEmitter<any> = new EventEmitter();
    @Output() onUpdateUser: EventEmitter<any> = new EventEmitter();
    @Output() closeNewUser: EventEmitter<any> = new EventEmitter();

    @Output() formChanged = new EventEmitter();

    constructor(private umService: UserManagementService, private userService: UserService, private notification: NotificationsService) { }

    clearInternalUserSearch() {
        this.riUserName = '';
        this.searching = false;
        this.showList = false;
        this.riUserList = [];
    }

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
        this.searching = user.length;
        this.showList = false;
        this.searchedUsers = {};
        this.riUserList = [];
        if (!user) { return; }
        this.timeOut = setTimeout(() => {
            this.umService.searchInternalUsers(user).subscribe((res) => {
                this.searchedUsers = res;
                this.riUserList = Object.keys(res);
                this.showList = true;
                this.searching = false;
                this.isAllFeildsChecked();

            }, (err) => {
                this.searching = false;
                this.showList = true;
                this.riUserList.push('No data found');

            });
        }, 1000);
    }

    userSelected(_user) {
        this.riUserName = '';
        this.showList = false;
        const user = this.searchedUsers[_user];
        if (!user) { return; }
        this.user.FirstName = user.displayname[0].split(' ')[0] || '';
        this.user.LastName = user.displayname ? user.displayname[0].split(' ')[1] : '';
        this.user.UserName = user.cn[0] || '';
        this.user.EmailID = user.mail ? user.mail[0] : '';
        this.riUserName = _user;
        this.selectedSearchUser = true;
        this.isFormValid = true;
    }

    onSubmit() {
        if (this.userObject.IsDistributor) {
            this.user.DistributorMasterID = this.userObject.Distributor.DistributorMasterId;
        }
        this.onMultiSelect(this.userBranch);
        if (!this.validateUser(this.user)) { return };
        // If user is RI internal user then distributor ID should be set to empty
        if (this.userDetails.IsDistributor) {
            this.user.DistributorMasterID = this.userDetails.Distributor.DistributorMasterId;
        } else if (this.user.IsRIInternal) {
            this.user.DistributorMasterID = '';
        }
        if (this.user.IsRIInternal || this.user.IsSeasonal) {

            if (this.addedBranches) {

                if (this.isNewUser) {
                    this.user.Branch = this.addedBranches;
                } else {

                    var obj: any = {};

                    this.tempUserBranch.forEach(branch => {
                        if (this.userBranch.indexOf(branch.BranchID + '') > -1 || this.userBranch.indexOf(branch.BranchID) > -1) {

                        } else {
                            obj = branch;
                            obj.IsActive = false;
                            this.addedBranches.push(obj);
                        }

                    });

                    this.user.Branch = this.addedBranches;
                }
            }

        } else {
            this.user.Branch = [];
        }
        this.isNewUser ? this.onSaveUser.emit(this.user) : this.onUpdateUser.emit(this.user);
    }

    validateUser(user) {
        if (!user.IsRIInternal) {
            if (!user.DistributorMasterID) {
                this.notification.error('Distributor is mandatory!!!');
                return false;
            } else if (user.IsSeasonal && !user.BranchID) {
                this.notification.error('Branch is mandatory!!!');
                return false;
            }
        } else {
            if (this.userBranch.length === 0) {
                this.notification.error('Branch is mandatory!!!');
                return false;
            }

        }
        return true;
    }

    ngAfterContentInit() {
        this.riUserName = '';

    }

    ngOnInit() {
        this.addedBranches = [];
        this.addedBranches.length = 0;
        this.getDistributor();
        this.userObject = this.userService.getUser();
        
        if (this.isNewUser) {
            this.user.RoleID = this.roles ? this.roles[0].RoleID : '';
            if (!this.isDistributorAdmin) {
                this.user.DistributorMasterID = this.distributorsAndCopackers ? this.distributorsAndCopackers[0].DistributorCopackerID : '';
            }
            this.user.Branch = this.branches ? this.branches[0] : [];
        }
        this.transformation();

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
        if (this.roleList && this.roleList.length === 1) {
            this.user.RoleID = this.roleList[0].RoleID;
        }
    }

    isDistributorSeasonal() {
        if (!this.user.DistributorMasterID) { return false }
        const tmp = this.distributorsAndCopackers.filter((dis) => {

            return dis.DistributorCopackerID === +this.user.DistributorMasterID;
        });

        return (tmp[0]) ? tmp[0].IsSeasonal : false;
    }

    changeHandler() {
        console.log("this.userBranch ", this.userBranch);
        if (this.userBranch.length > 0) { this.isEmailExist = false; this.isFormValid = true; this.formIsDirty = true; }
        this.user.IsSeasonal = this.isDistributorSeasonal();
        this.isAllFeildsChecked();
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
        setTimeout(this.formChanged.emit('changed'), 1000);

    }

    resetUser() {
        this.user = {};
    }
    checkEmail(email) {
        this.userService.isUserExist(email).subscribe((res) => {
            // console.log(res);
            if (res.Message === 'Email already exists') {
                this.isEmailExist = true;
            } else {
                this.isEmailExist = false;
            }

        }, (err) => {

        });
    }

    roleChange(roleID) {
        roleID = roleID + '';
        this.userBranch = [];

        if (roleID === '1' || roleID === '2' || roleID === '4' || roleID === '5') {
            if (roleID === '2') {
                this.showIseries = true;
            }
            this.cBranches = [];
            this.cBranches = [{ value: '1', label: '1 - All Branches', data: { BranchID: 1, BranchCode: 1, BranchName: 'All Branches', IsActive: true } }];
            this.userBranch = [1];

        } else {
            this.showIseries = false;
            this.user.RoleID = roleID;
            this.userBranch = [];
            this.cBranches = this.tBranches;
            if (this.cBranches[0].value == '1') {
                this.cBranches.shift();
            }
        }
        this.getDistributor();

    }

    loadBranches() {
        if (!this.userBranch) { return; }

        this.getDistributor();
    }
    spaceRemover(value) {
        this.user.LastName = value.replace(/^\s+|\s+$/g, '');
    }
    spaceRemoverFn(value) {
        this.user.FirstName = value.replace(/^\s+|\s+$/g, '');
    }
    riChangeHandler(status) {
        console.log(status);
        if (status) {
            this.user.FirstName = '';
            this.user.LastName = '';
            this.user.EmailID = '';
        }
        else {

            this.getDistributor();
        }
        this.isAllFeildsChecked();

    }
    filterDistributor(dist, role) {
        let uRole = this.userObject.Role.RoleID
        if (!dist || !role) { return [] };
        if (uRole === 1 && +role === 2) {
            return dist.filter((user) => !user.IsSeasonal);
        } else if (uRole === 2 && +role === 3) {
            return dist.filter((user) => user.IsSeasonal);
        }
        return dist;
    }
    getDistributor() {
        this.umService.getDistributerAndCopacker().subscribe((res) => {
            let dists: any = this.filterDistributor(res, this.user.RoleID);
            let tempArr = []

            dists.forEach(distrib => {
                tempArr.push({
                    value: distrib.DistributorCopackerID,
                    label: distrib.Name,
                    date: distrib
                });
            });
            this.distributorsAndCopackers = tempArr;
        });
    }

    isAllFeildsChecked() {
        console.log(this.user.FirstName);
        if (this.user.FirstName == '' || this.user.LastName == '' || this.user.EmailID == ''
            || this.user.RoleID == undefined) {
            this.isFormValid = false;
        }
        else {
            this.isFormValid = true;
        }
    }

    getMultiBranches() {
        this.umService.getMultiBranches().subscribe((res) => {
            console.log("--- ", res);
            this.branchList = res;
            if (this.cBranches) { this.cBranches.length = 0; }
            let tempArr = []

            res.forEach(branch => {
                tempArr.push({
                    value: branch.BranchID,
                    label: `${branch.BranchCode} - ${branch.BranchName}`,
                    date: branch
                });
            });

            this.cBranches = tempArr;
            this.tBranches = tempArr;
        }, (err) => {
            console.log("Error");
        });
    }

    transformation() {
        this.getMultiBranches();
    }
    onMultiSelect(optionsModel) {
        if (this.addedBranches) { this.addedBranches.length = 0; }
        this.addedBranches = [];
        if (optionsModel) {
            for (let branch of this.branchList) {
                if (optionsModel.indexOf(branch.BranchID + '') > -1 || optionsModel.indexOf(branch.BranchID) > -1) {
                    this.addedBranches.push({ BranchID: branch.BranchID, BranchCode: branch.BranchCode, BranchName: branch.BranchName, IsActive: true });
                }
            }
        }
    }
    populatateRoleList() {
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
        }
    }
}
