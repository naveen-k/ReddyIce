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
  hideColumn: boolean = false;
  isDistributorAdmin: boolean = false;
  cardTitle: string;
  userDetails: UserDetails;
  formIsDirty: boolean = false;
  isDistributorExist: boolean = false;
  isEditClicked: boolean = false;
  action: string = '';
  userObject: any = [];
  // isError: boolean = false;
  showSpinner: boolean = true;

  usersList: any[];

  // ngModel for usertype dropdown
  userType: string = 'active';

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
      IsActive: this.action === 'edit' ? true : false,
      IsSeasonal: true,
      // IsRIInternal: false,
    };
  }

  formChangedHandler() {
    this.formIsDirty = true;
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
        this.newUser.RoleID = user.Role ? user.Role.RoleID : '';
        this.newUser.DistributorMasterID = user.Distributor ? user.Distributor.DistributorMasterId : '';
        this.isNewUser = false;
        this.action = 'edit';
        // location.reload();

      });

    } else {
      // this.isEditClicked = true;
      this.action = 'edit';
      this.newUser = Object.assign({}, user);
      this.newUser.BranchID = user.Branch ? user.Branch.BranchID : '';
      this.newUser.RoleID = user.Role ? user.Role.RoleID : '';
      this.newUser.DistributorMasterID = user.Distributor ? user.Distributor.DistributorMasterId : '';
      this.cardTitle = 'Edit User';
      this.isNewUser = false;
    }
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
        this.newUser.RoleID = user.Role ? user.Role.RoleID : '';
        this.newUser.DistributorMasterID = user.Distributor ? user.Distributor.DistributorMasterId : '';
        this.isNewUser = false;
        this.action = 'edit';
        // location.reload();

      });

    }else {
      this.cardTitle = 'User Detail';
      this.newUser = Object.assign({}, user);
      this.newUser.BranchID = user.Branch ? user.Branch.BranchID : '';
      this.newUser.RoleID = user.Role ? user.Role.RoleID : '';
      this.newUser.DistributorMasterID = user.Distributor ? user.Distributor.DistributorMasterId : '';
      this.isNewUser = false;
      this.action = 'view';
      if (!this.rightCardOpen) {
        this.rightCardOpen = !this.rightCardOpen;
        this.hideColumn = !this.hideColumn;
      }
    }
    
  }

  onSaveUser(user) {
    delete user.role;
    if (!user.IsRIInternal) { delete user.UserName; }
    this.service.createUser(user).subscribe((res) => {
      this.notification.success('Success', 'User created successfully');
      const savedUserlist = [...this.userTableData, res];
      console.log(res);
      this.userTableData = savedUserlist;

      this.rightCardOpen = !this.rightCardOpen;
      this.hideColumn = !this.hideColumn;
      this.isNewUser = false;
      this.formIsDirty = false;
      
    },
      (error) => {
        console.log();
        error = JSON.parse(error._body);
        this.notification.error('Error', error.Message);
      });
  }

  onUpdateUser(user) {
    delete user.Role;
    delete user.MenuOptions;
    delete user.Branch;
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
    });
  }

  getDistributors() {
    this.service.getDistributerAndCopacker().subscribe((response) => {
      this.distributorsAndCopackers = response;
    });
  }

  getUserList(id?: number) {
    this.showSpinner = true;
    this.service.getUsers(id).subscribe((res) => {
      res.forEach((u) => {
        u = this.formatUser(u);
      });
      this.usersList = res;
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

  formatUser(user: any) {
    user.tmp_branch = `${(user.Branch ? user.Branch.BranchCode : 'NA')} - ${(user.Branch ? user.Branch.BranchName : 'NA')}`;
    user['tmp_role'] = `${(user.Role ? user.Role.RoleName : '')}`;
    user['tmp_distributor'] = `${(user.Distributor ? user.Distributor.DistributorName : '')}`;
    return user;
  }

  ngOnInit() {
    this.userObject = this.userService.getUser();
    // console.log(this.userObject.Role.RoleName);
    const userId = localStorage.getItem('userId') || '';
    this.userService.getUserDetails(userId).subscribe((response) => {
      this.userDetails = response;
      this.isDistributorExist = response.IsDistributor;
      this.userRoles = response.RoleList;
      // console.log(this.userRoles);
      if (!response.IsDistributor) {
        this.getUserList(parseInt(userId, 10));
        this.getBranches();
        this.getDistributors();
      } else if (response.IsDistributor) {
        this.getBranches();
        this.isDistributorAdmin = true;
        this.getUserList(parseInt(userId, 10));
      }
    });

  }

  trackByTable(i, item) {
    return item ? item.id : undefined;
  }

  changeUserTypeHandler() {
    this.updateUserTableOnTypeChange();
  }

}
