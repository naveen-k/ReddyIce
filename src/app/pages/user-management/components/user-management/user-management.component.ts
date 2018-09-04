import { timeInterval } from 'rxjs/operator/timeInterval';
import { UserDetails } from '../../../../shared/user.interface';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { UserService } from '../../../../shared/user.service';
import { UserManagementService } from '../../user-management.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { User } from '../../user-management.interface';
import { selector } from 'rxjs/operator/multicast';
import { any } from 'codelyzer/util/function';
import { ModelPopupComponent } from '../../../../shared/components/model-popup/model-popup.component';
import { NotificationsService } from 'angular2-notifications';

@Component({
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  rightCardOpen: boolean = false;
  isNewUser: boolean = false;
  selectedUser = {};
  newUser: any = {};
  loggedUserdata: any = {};
  hideColumn: boolean = false;
  isDistributorAdmin: boolean = false;
  cardTitle: string;
  userDetails: UserDetails;
  IsSesonalTrue: boolean = false;
  formIsDirty: boolean = false;
  isDistributorExist: boolean = false;
  isEditClicked: boolean = false;
  action: string = '';
  userObject: any = [];
  // isError: boolean = false;
  showSpinner: boolean = true;
  filterBranch: number = 1;
  allBranches: any = [];
  usersList: any[];

  // ngModel for usertype dropdown
  userType: string = 'active';
  userSubTitle: string = '';
  idDataLoaded: boolean = false;
  constructor(
    private service: UserManagementService,
    private notification: NotificationsService,
    private userService: UserService,
    private modalService: NgbModal,
  ) { }

  showNewCustomer(newCustomer) {
    this.formIsDirty = false;
    this.action = 'create';
    this.rightCardOpen = !this.rightCardOpen;
    this.isNewUser = true;
	
    this.hideColumn = !this.hideColumn;
    this.cardTitle = 'Create New User';
    this.newUser = <User>{
      FirstName: '',
      LastName: '',
      UserName: '',
      EmailID: '',
      BranchID: '',
      Phone: '',
      role: '',
      IsActive: this.action === 'create' ? true : false,
      IsSeasonal: true,
      // IsRIInternal: false,
    };
    if(this.action === 'create'){
      document.forms['userForm'].reset();
    }
  }

  formChangedHandler() {
    this.formIsDirty = true;
  }
forcelogOut(loggedUser){
	console.log(loggedUser);
	this.service.Killhistory(loggedUser.UserActivityLogID,loggedUser.Source).subscribe((res) => {
			this.notification.success('Success', 'User session has been logged out successfully.');
			
      this.rightCardOpen = !this.rightCardOpen;
      this.isNewUser = false;
      this.formIsDirty = false;
      //const userId = localStorage.getItem('UserID');
	   //const userId = localStorage.getItem('userId');
	  //console.log(userId);
      //this.getUserList(parseInt(userId)); 
		
			},(error) => {
				error = JSON.parse(error._body);
				this.notification.error('Error', error.Message);
			});
}
  closeRightCard() {
    if (this.formIsDirty) {
      const activeModal = this.modalService.open(ModalComponent, {
        size: 'sm',
        backdrop: 'static',
      });
      activeModal.componentInstance.BUTTONS.OK = 'Discard';
      activeModal.componentInstance.showCancel = true;
      activeModal.componentInstance.modalHeader = 'Warning!';
      activeModal.componentInstance.modalContent = `You have unsaved changes, do you want to discard?`;
      activeModal.componentInstance.closeModalHandler = (() => {
        this.rightCardOpen = !this.rightCardOpen;
        this.isNewUser = false;
        this.hideColumn = !this.hideColumn;
        this.formIsDirty = false;

      });

    } else {
      this.rightCardOpen = !this.rightCardOpen;
      this.isNewUser = false;
      this.hideColumn = !this.hideColumn;
    }
    this.formIsDirty = false;
    this.action = 'create';

    this.isNewUser = true;


    this.newUser = <User>{
      FirstName: '',
      LastName: '',
      UserName: '',
      EmailID: '',
      BranchID: '',
      Phone: '',
      role: '',
      IsActive: this.action === 'create' ? true : false,
      IsSeasonal: true,
      // IsRIInternal: false,
    };
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    if (event.target.innerWidth > 1010) {
      this.hideColumn = false;
    } else if (event.target.innerWidth > 778 && event.target.innerWidth < 1010) {
      this.hideColumn = true;
    }
  }

  userTableData: User[];
  userRoles: any[] = [];
  userBranches: any[] = [];
  distributorsAndCopackers: any[] = [];
  paginationData: any = [];

  toInt(num: string) {
    return +num;
  }

  sortByWordLength = (a: any) => {
    return a.city.length;
  }

  onEditClicked(user) {
    if (this.rightCardOpen && this.formIsDirty) {
      if (this.formIsDirty) {
        const activeModal = this.modalService.open(ModalComponent, {
          size: 'sm',
          backdrop: 'static',
        });
        activeModal.componentInstance.BUTTONS.OK = 'Discard';
        activeModal.componentInstance.showCancel = true;
        activeModal.componentInstance.modalHeader = 'Warning!';
        activeModal.componentInstance.modalContent = `You have unsaved changes, do you want to discard?`;
        activeModal.componentInstance.closeModalHandler = (() => {
          this.formIsDirty = false;
          this.rightCardOpen = !this.rightCardOpen;
        });
      }
    }

    this.action = 'edit';
	this.loggedUserdata = {};
	this.service.GetUserHistory(user.UserId).subscribe((res) => {
		if(res){
			this.loggedUserdata = res;
		}	
		}, err => {
					console.log(err);
					this.loggedUserdata = {};
         }
		
		
		);
    this.newUser = Object.assign({}, user);
    //this.newUser.BranchID = user.Branch ? user.Branch.BranchID : '';
    this.newUser.Branch = user.Branch;
    this.newUser.RoleID = user.Role ? user.Role.RoleID : '';
    this.newUser.DistributorMasterID = user.Distributor ? user.Distributor.DistributorMasterId : '';
    this.cardTitle = 'Edit User';
    this.isNewUser = false;
    if (!this.rightCardOpen) {
      this.rightCardOpen = !this.rightCardOpen;
      this.hideColumn = !this.hideColumn;

    }

  }

  onView(user) {
    if (this.formIsDirty) {
      const activeModal = this.modalService.open(ModalComponent, {
        size: 'sm',
        backdrop: 'static',
      });
      activeModal.componentInstance.BUTTONS.OK = 'Discard';
      activeModal.componentInstance.showCancel = true;
      activeModal.componentInstance.modalHeader = 'Warning!';
      activeModal.componentInstance.modalContent = `You have unsaved changes, do you want to discard?`;
      activeModal.componentInstance.closeModalHandler = (() => {
        this.formIsDirty = false;

        this.cardTitle = 'Edit Detail';
        this.newUser = Object.assign({}, user);
        this.newUser.BranchID = user.Branch ? user.Branch.BranchID : '';
        this.newUser.Branch = user.Branch;
        this.newUser.RoleID = user.Role ? user.Role.RoleID : '';
        this.newUser.DistributorMasterID = user.Distributor ? user.Distributor.DistributorMasterId : '';
        this.isNewUser = false;
        this.action = 'edit';

      });

    } else {
      this.cardTitle = 'User Detail';
      this.newUser = Object.assign({}, user);
      //this.newUser.BranchID = user.Branch ? user.Branch.BranchID : '';
      this.newUser.Branch = user.Branch;
      this.newUser.RoleID = user.Role ? user.Role.RoleID : '';
      this.newUser.DistributorMasterID = user.Distributor ? user.Distributor.DistributorMasterId : '';
      this.isNewUser = false;
      this.action = 'view';
	  this.loggedUserdata = {};
	  this.service.GetUserHistory(user.UserId).subscribe((res) => {
		if(res){
			this.loggedUserdata = res;
		}
		});
      if (!this.rightCardOpen) {
        this.rightCardOpen = !this.rightCardOpen;
        this.hideColumn = !this.hideColumn;
      }
    }

  }

  onSaveUser(user) {
    delete user.role;
    delete user.BranchID;
    if (!user.IsRIInternal) { delete user.UserName; }
    // if(user.Branch.length>0){

    // }
    this.service.createUser(user).subscribe((res) => {
      this.notification.success('Success', 'User created successfully');
      const savedUserlist = [...this.userTableData, res];
      this.userTableData = savedUserlist;

      this.rightCardOpen = !this.rightCardOpen;
      this.hideColumn = !this.hideColumn;
      this.isNewUser = false;
      this.formIsDirty = false;
      const userId = localStorage.getItem('userId');
      this.getUserList(parseInt(userId));

    },
      (error) => {
        error = JSON.parse(error._body);
        this.notification.error('Error', error.Message);
      });
  }

  onUpdateUser(user) {
    delete user.Role;
    delete user.MenuOptions;
    //delete user.Branch;
    delete user.Distributor;
    this.service.updateUser(user, user.UserId).subscribe((res) => {
      this.notification.success('Success', 'User updated successfully');
      let indexPos: any;
      const users = [...this.userTableData];
      this.userTableData.forEach((_user, index) => {
        if (_user.UserId === user.UserId) {
          indexPos = index;
        }
      });

      users.splice(indexPos, 1, this.formatUser(res));
      this.userTableData = users;

      this.rightCardOpen = !this.rightCardOpen;
      this.hideColumn = !this.hideColumn;
      this.isNewUser = false;
      this.formIsDirty = false;
      const userId = localStorage.getItem('userId');
      this.getUserList(parseInt(userId));

    },
      (error) => {
        error = JSON.parse(error._body);
        this.notification.error('Error', error.Message);
      });

  }

  deleteUser(user) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      backdrop: 'static',
    });
    activeModal.componentInstance.BUTTONS.OK = 'OK';
    activeModal.componentInstance.showCancel = true;
    activeModal.componentInstance.modalHeader = 'Warning!';
    activeModal.componentInstance.modalContent = `Are you sure you want to deactivate ${user.UserName}?`;
    activeModal.componentInstance.closeModalHandler = (() => {
      this.service.deleteUser(user.UserId).subscribe((res) => {
        this.notification.success('Success', `User ${user.UserName} deactivated successfully`);
        this.usersList = this.usersList.filter(u => u.UserId !== user.UserId);
        this.updateUserTableOnTypeChange();
        const userId = localStorage.getItem('userId');
        this.getUserList(parseInt(userId));

        // this.userTableData = this.userTableData.filter((userObj) => userObj.UserId !== user.UserId);
      },
        (error) => {
          error = JSON.parse(error._body);
          this.notification.error('Error', error.Message);
        });
    });

  }

  getRole() {
    this.service.getRoles().subscribe((response) => {
      this.userRoles = response;
    });
  }

  getBranches() {
    const user = this.userService.getUser();
    this.service.getBranches(user.UserId).subscribe((response) => {
      this.userBranches = response;
      if (this.userBranches && this.userBranches.length) {
        if (this.userBranches.length > 0 && this.userBranches[0].BranchID == 1) {
          this.filterBranch = this.userBranches[1].BranchID;
        } else if (this.userBranches.length > 0 && this.userBranches[0].BranchID != 1) {
          this.filterBranch = this.userBranches[0].BranchID;
        }
      }
      this.allBranches = this.service.transformOptionsReddySelect(this.userBranches, 'BranchID', 'BranchCode', 'BUName');
      if (!this.isDistributorExist) {
        this.getDistributors();
      }

    });
  }

  getDistributors() {
    this.service.getDistributerAndCopacker().subscribe((response) => {
      this.distributorsAndCopackers = response;
      this.getUserList(parseInt(this.logUserID, 10));
    });
  }

  getUserList(id?: number) {
    if (this.isDistributorExist) {
      this.filterBranch = 1;
    }
    this.showSpinner = true;
    this.service.getUsers(id, this.filterBranch).subscribe((res) => {

      const userBranch = {};
      res.UserBranches.forEach(u => {
        if (userBranch[u.UserID]) {
          userBranch[u.UserID].push(u);
          return;
        }
        userBranch[u.UserID] = [u];
      });
      res.User.forEach((u) => {
        u['Branch'] = userBranch[u.UserId];
        u['Role'] = { 'RoleID': u.RoleID, 'RoleName': u.RoleName };
        if (u.DistributorMasterID) {
          u['Distributor'] = { 'DistributorMasterId': u.DistributorMasterID, 'DistributorName': u.DistributorCopackerName }
        }

        u = this.formatUser(u);
      });

      this.usersList = res.User;
      this.updateUserTableOnTypeChange();
      this.showSpinner = false;
    }, (error) => {
      this.showSpinner = false;
    });
  }

  updateUserTableOnTypeChange() {
    this.userTableData = this.usersList.filter((u) => {
      if (this.userType === 'active') {
        return u.IsActive;
      }
      if (this.userType === 'inActive') {
        return !u.IsActive;
      }
      return true;
    });
  }


  formatUser(user: any = '') {
    user.tmp_branch = `${(user.Branch ? user.Branch.BranchCode : 'NA')} - ${(user.Branch ? user.Branch.BUName : 'NA')}`;
    if (user.Branch) {
      user.concatBranch = user.Branch.map(function (elem) {
        return elem.BUName;
      }).join(",");

      user.concatCode = user.Branch.map(function (elem) {
        return elem.BranchCode;
      }).join(",");

      user.concatBranchCode = user.Branch.map(function (elem) {
        return elem.BranchCode + ' - ' + elem.BUName;
      }).join(",");
    }
    user['tmp_role'] = `${(user.Role ? user.Role.RoleName : '')}`;
    user['tmp_distributor'] = `${(user.Distributor ? user.Distributor.DistributorName : '')}`;
    return user;
  }
  logUserID: any;
  ngOnInit() {
    this.userObject = this.userService.getUser();
    const userId = localStorage.getItem('userId') || '';
    this.logUserID = userId;
    this.userService.getUserDetails(userId).subscribe((response) => {
      this.idDataLoaded = true;
      this.userDetails = response;
      if (this.userDetails.IsSeasonal) {
        this.IsSesonalTrue = true;
      } else {
        this.IsSesonalTrue = false;
      }
      this.isDistributorExist = response.IsDistributor;
      this.userRoles = response.RoleList;
      
      if (!response.IsDistributor) {
        this.getBranches();
      } else if (response.IsDistributor) {
        this.getBranches();
        this.isDistributorAdmin = true;
        this.getUserList(parseInt(userId, 10));
        this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + response.Distributor.DistributorName : '';
      }
    });

  }

  trackByTable(i, item) {
    return item ? item.id : undefined;
  }

  changeUserTypeHandler() {
    this.updateUserTableOnTypeChange();
  }
  /**
   * Get more branches list by clicking on more link
   * @params : branches, username
   */
  moreBranches(branches, username) {
    const activeModal = this.modalService.open(ModelPopupComponent, {
      size: 'sm',
      backdrop: 'static',
    });
    let cstring = [];
    branches.find((val) => {
      if (typeof val === 'object') {
        if (val['IsActive'] === true) {
          cstring.push(val['BranchCode'] + ' - ' + val['BUName']);
        }
      }

    });

    let branch = cstring;
    activeModal.componentInstance.showCancel = false;
    activeModal.componentInstance.modalHeader = `Selected Business Unit of ${username}`;
    activeModal.componentInstance.modalContent = branch;
    activeModal.componentInstance.closeModalHandler = (() => {

    });
  }
  /**
   * Filter logged-in user's branches
   */
  branchChangeHandler() {
    this.getUserList(parseInt(this.logUserID, 10));
  }
}
