import { UserDetails } from '../../../../shared/user.interface';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  newUser: any = {};
  hideColumn: boolean = false;
  isDistributorAdmin: boolean = false;
  cardTitle: string;
  userDetails: UserDetails;
  formIsDirty: boolean = false;
  isDistributorExist: boolean = false;
  isEditClicked: boolean = false;
  action: string = '';
  userObject: any= [];
  constructor(
    private service: UserManagementService,
    private notification: NotificationsService,
    private userService: UserService,
    private modalService: NgbModal,
  ) { }

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
      BranchID: '',
      Phone: '',
      role: '',
      IsActive: true,
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
    this.isEditClicked = true;
    this.action = 'edit';
    this.newUser = Object.assign({}, user);
    this.newUser.BranchID = user.Branch ? user.Branch.BranchID : '';
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
        
    this.cardTitle = 'User Detail';
    this.newUser = Object.assign({}, user);
    this.newUser.BranchID = user.Branch ? user.Branch.BranchID : '';
    this.newUser.RoleID = user.Role ? user.Role.RoleID : '';
    this.newUser.DistributorMasterID = user.Distributor ? user.Distributor.DistributorMasterId : '';
    this.isNewUser = false;
    this.action = 'view';

      });

    } else {
      
      this.cardTitle = 'User Detail';
    this.newUser = Object.assign({}, user);
    this.newUser.BranchID = user.Branch ? user.Branch.BranchID : '';
    this.newUser.RoleID = user.Role ? user.Role.RoleID : '';
    this.newUser.DistributorMasterID = user.Distributor ? user.Distributor.DistributorMasterId : '';
    this.isNewUser = false;
    this.action = 'view'; 
   
    }
   
    if (!this.rightCardOpen ) {
      this.rightCardOpen = !this.rightCardOpen;
      this.hideColumn = !this.hideColumn;

    }

  }

  onSaveUser(user) {
    delete user.role;
    if (!user.IsRIInternal) { delete user.UserName; }
    this.service.createUser(user).subscribe((res) => {
      this.notification.success('Success', 'User created successfully');
      const savedUserlist = [...this.userTableData, res];
      this.userTableData = savedUserlist;

    this.rightCardOpen = !this.rightCardOpen;
    this.hideColumn = !this.hideColumn;
    this.isNewUser = false;

    },
      (error) => {
        this.notification.error('Error', 'Failed to create user.');
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
      users.splice(indexPos, 1, res);
      this.userTableData = users;
    },
      (error) => {
        console.log(error);
        this.notification.error('Error', `Failed to update user ${user.UserName}`);
      });

    this.rightCardOpen = !this.rightCardOpen;
    this.hideColumn = !this.hideColumn;
    this.isNewUser = false;
  }

  deleteUser(user) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'sm',
      backdrop: 'static',
    });
    activeModal.componentInstance.BUTTONS.OK = 'OK';
    activeModal.componentInstance.showCancel = true;
    activeModal.componentInstance.modalHeader = 'Warning!';
    activeModal.componentInstance.modalContent = `Are you sure you want to delete ${user.UserName}?`;
    activeModal.componentInstance.closeModalHandler = (() => {
      this.service.deleteUser(user.UserId).subscribe((res) => {
        this.notification.success('Success', `User ${user.UserName} deactivated successfully`);
        this.userTableData = this.userTableData.filter((userObj) => userObj.UserId !== user.UserId);
      },
        (error) => {
          this.notification.error('Error', `Failed to deactivate user.`);
        });
    });

  }

  getRole() {
    this.service.getRoles().subscribe((response) => {
      this.userRoles = response;
    });
  }

  getBranches() {
    this.service.getBranches().subscribe((response) => {
      this.userBranches = response;
    });
  }

  getDistributors() {
    this.service.getDistributerAndCopacker().subscribe((response) => {
      this.distributorsAndCopackers = response;
    });
  }

  getUserList(id?: number) {
    this.service.getUsers(id).subscribe((res) => {
      res.forEach((u) => {
        u.tmp_branch = `${(u.Branch ? u.Branch.BranchID : 'NA')} (${(u.Branch ? u.Branch.BranchName : 'NA')})`;
      });
      this.userTableData = res;
    });
  }

  ngOnInit() {
    // this.userObject = this.userService.getUser();
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


}
