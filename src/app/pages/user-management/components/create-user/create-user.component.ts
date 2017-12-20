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
    userBranch: any = [];
    tBranches: any = [];
    selectedBranch: any = [];
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
    distributorsAndCopackers: any = [];
    //cacheDistributor: any = [];


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
    @Input() cacheDistributor: any;
    @Input() isDistributorAdmin: boolean;

    @Input()
    get user(): any {
        return this._user;
    }
    set user(val: any) {
        if (!Object.keys(val).length) {
            return;
        }
        // to empty the role field if discard or back button is clicked without saving data.
        this._user = val;
        this.populatateRoleList();
        if (this.actionName == 'edit') {
            val.RoleID = val.RoleID || this._user.RoleID;
            this.roleChange(val.RoleID, 'retainDist');
        } else {
            if (!this.user.RoleID) {
                this.user.RoleID = '';
            }
        }
        this.loadBranches();
        this._user.IsSeasonal = this.isDistributorSeasonal();
        if (this.tempUserBranch) { this.tempUserBranch.length = 0; }
        this.tempUserBranch = [];
        if (this.user.Branch) {
            this.tempUserBranch = this.user.Branch.slice();
            console.log("this.tempUserBranch -", this.tempUserBranch);
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
                for (i = 0; i < this.user.Branch.length; i++) {
                    if (this.user.Branch[i].IsActive === true) {
                        this.userBranch.push(this.user.Branch[i].BranchID);
                        this.selectedBranch.push(this.user.Branch[i]);
                    }
                }

            }
        }
        //this.pushBranches();
    }
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
        console.log(_user);
        const user = this.searchedUsers[_user];
        console.log(user);
        if (!user) { return; }
        this.user.FirstName = user.givenName || '';    //[0].split(' ')[0] || '';
        this.user.LastName = user.displayname || ''; //? user.displayname[0].split(' ')[1] : '';
        this.user.UserName = user.cn || ''; //[0] || '';
        this.user.EmailID = user.mail ? user.mail : ''; //[0] : '';
        this.user.Phone = user.phone ? user.phone : '';
        this.riUserName = _user;
        this.selectedSearchUser = true;
        this.isFormValid = true;
    }

    onSubmit() {
        if (this.userObject.IsDistributor) {
            this.user.DistributorMasterID = this.userObject.Distributor.DistributorMasterId;
        }
        //this.onMultiSelect(this.userBranch);
        if (!this.validateUser(this.user)) { return };
        // If user is RI internal user then distributor ID should be set to empty
        if (this.userDetails.IsDistributor) {
            this.user.DistributorMasterID = this.userDetails.Distributor.DistributorMasterId;
        } else if (this.user.IsRIInternal) {
            this.user.DistributorMasterID = '';
        }
        if (this.user.IsRIInternal || this.user.IsSeasonal) {
            if (this.user.RoleID == '6' || this.user.RoleID == '3') {
                this.populateIseriseRoute();
            }
            if (this.addedBranches) {

                if (this.isNewUser) {
                    this.user.Branch = this.addedBranches;
                } else {
                    var obj: any = {};
                    this.tempUserBranch.forEach(branch => {
                        obj = branch;
                        if (this.userBranch.indexOf(branch.BranchID + '') > -1 || this.userBranch.indexOf(branch.BranchID) > -1) {

                        } else {
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
        //console.log(this.selectedBranch);
        //console.log(this.user);
        this.isNewUser ? this.onSaveUser.emit(this.user) : this.onUpdateUser.emit(this.user);
    }
    private populateIseriseRoute() {
        /*let tempB = [];
        this.selectedBranch.forEach(branch=>{
            tempB.push({ BranchID: branch.value, BranchCode: branch.data.BranchCode, BranchName:branch.label , IsActive: true ,IseriesRouteNumber:branch.IseriesRouteNumber});
           
        });*/
        this.addedBranches = this.selectedBranch;
    }
    validateUser(user) {
        if (!user.IsRIInternal || !user.IsRIInternal === undefined) {
            if (!user.DistributorMasterID) {
                this.notification.error('Distributor is mandatory!!!');
                return false;
            } else if (user.IsSeasonal && (!this.userBranch || this.userBranch.length === 0)) {
                this.notification.error('Branch is mandatory!!!');
                return false;
            }
        } else {
            if (this.userBranch.length === 0) {
                this.notification.error('Branch is mandatory!!!');
                return false;
            }

        }
        if (this.showIseries === true && (user.ISeriesRouteNumber === undefined || user.ISeriesRouteNumber === null || user.ISeriesRouteNumber == 0)) {
            this.notification.error('ISeriesRoute Number is mandatory!!!');
            return false;
        }
        if (!this.showIseries && this.selectedBranch && this.selectedBranch.length && this.selectedBranch.length > 0) {
            if (this.user.RoleID == '3' || this.user.RoleID == '6') {
                var check = true;
                for (let i = 0; i < this.selectedBranch.length; i++) {
                    if (this.selectedBranch[i].IseriesRouteNumber === undefined || this.selectedBranch[i].IseriesRouteNumber === null || this.selectedBranch[i].IseriesRouteNumber == '') {
                        this.notification.error('All ISeriesRoute Number is mandatory!!!');
                        check = false;
                        break;
                    }

                }
                return check;
            }
        }

        return true;
    }

    ngAfterContentInit() {
        this.riUserName = '';
        this.addedBranches = [];
        this.addedBranches.length = 0;
        this.getDistributor();
        this.userObject = this.userService.getUser();
        //console.log(this.userObject);

        if (this.isNewUser) {
            this.user.RoleID = this.roles ? this.roles[0].RoleID : '';
            if (!this.isDistributorAdmin) {
                this.user.DistributorMasterID = this.distributorsAndCopackers ? this.distributorsAndCopackers[0].DistributorCopackerID : '';
            }
            this.user.Branch = this.branches ? this.branches[0] : [];
        }
        this.transformation();

    }

    ngOnInit() {

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
            return dis.data.DistributorCopackerID === +this.user.DistributorMasterID;
        });

        return (tmp[0]) ? tmp[0].data.IsSeasonal : false;
    }

    enableSave() {
        this.formIsDirty = true;
    }

    changeHandler() {
        if (this.userBranch.length > 0) { this.isEmailExist = false; this.isFormValid = true; this.formIsDirty = true; }
        this.user.IsSeasonal = this.isDistributorSeasonal();
        this.hideISeriesRoute();
        this.user.IsChecker = this.user.IsChecker || false;
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
                    IsChecker: false,
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

    roleChange(roleID, retainDist: any = '') {
        roleID = roleID + '';
        if (retainDist === '') {
            this.user.DistributorMasterID = 0;
        }


        if (roleID === '1' || roleID === '2' || roleID === '4' || roleID === '5' || roleID === '8') {
            this.cBranches = [];
            this.cBranches = [{ value: '1', label: '1 - All Branches', data: { BranchID: 1, BranchCode: 1, BranchName: 'All Branches', IsActive: true } }];
            this.userBranch = [1];

        } else {
            this.user.RoleID = roleID;
            this.userBranch = this.userBranch.filter(u => u != 1);
            this.cBranches = this.tBranches;
            console.log(this.cBranches);
            if (this.cBranches[0].value === 1) {
                this.cBranches.shift();
            }

            // Alok- show ISeries for Drive
            /* if (roleID === '3' && this.userObject.IsRIInternal) {
                 this.showIseries = true;
             }*/

        }
        this.hideISeriesRoute();
        // if (this.action == 'edit') {
        //    this.transformation();
        // }
        //this.pushBranches();
        this.selectedBranch = [];
        this.getDistributor();

    }
    hideISeriesRoute() {
        if (this.user.IsRIInternal || this.user.IsSeasonal) {
            this.showIseries = false;
        } else {
            this.showIseries = true;
        }
    }
    loadBranches() {
        //if (!this.userBranch) { return; }

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
        this.hideISeriesRoute();
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
        // if (uRole === 1 && +role === 2) {
        //     return dist.filter((user) => user.IsSeasonal);
        // } else 
        // debugger;
        if (uRole === 2 && +role === 3) {
            return dist.filter((user) => user.IsSeasonal);
        }
        return dist;
    }
    getDistributor() {
        if (this.cacheDistributor && this.cacheDistributor.length > 0) {
            let dists: any = this.filterDistributor(this.cacheDistributor, this.user.RoleID);
            let tempArr = []

            dists.forEach(distrib => {
                tempArr.push({
                    value: distrib.DistributorCopackerID,
                    label: distrib.Name,
                    data: distrib
                });
            });
            this.distributorsAndCopackers = tempArr;
        } else {
            this.umService.getDistributerAndCopacker().subscribe((res) => {
                let dists: any = this.filterDistributor(res, this.user.RoleID);
                let tempArr = []
                this.cacheDistributor = res;
                dists.forEach(distrib => {
                    tempArr.push({
                        value: distrib.DistributorCopackerID,
                        label: distrib.Name,
                        data: distrib
                    });
                });
                this.distributorsAndCopackers = tempArr;
            });
        }

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
                    data: branch
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
        //this.pushBranches(this.userBranch);
    }
    onMultiSelect(optionsModel) {
        if (this.addedBranches) { this.addedBranches.length = 0; }
        this.addedBranches = [];
        if (optionsModel) {
            for (let branch of this.selectedBranch) {
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
    pushBranches() {
        const cloneSelectedBranch = this.userBranch.join("--").split("--");

        let selectedBranch = this.selectedBranch.filter(b => {
            if (cloneSelectedBranch.indexOf(b.BranchID + '') >= 0) {
                cloneSelectedBranch.splice(cloneSelectedBranch.indexOf(b.BranchID + ''), 1);
                return true;
            }
            return false;
        })

        cloneSelectedBranch.map(b => {
            const br = this.branchList[this.branchList.findIndex((cb) => +cb.BranchID === +b)];
            selectedBranch.push({
                'BranchID': br.BranchID,
                'BranchCode': br.BranchCode,
                'BranchName': br.BranchName
            })
        })

        this.selectedBranch = selectedBranch;
    }
    removeBranch(branch) {
        this.formIsDirty = true;
        setTimeout(this.formChanged.emit('changed'), 1000);
        this.userBranch = this.userBranch.filter((u) => +u !== +branch.BranchID);
        this.pushBranches();
    }
    clearBranch() {
        this.userBranch = [];
        this.selectedBranch = [];
    }

}
