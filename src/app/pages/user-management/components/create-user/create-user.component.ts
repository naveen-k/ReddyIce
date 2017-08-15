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
    userDetails: any;

    distributorsAndCopackers: any[] = [];
    branches: any[] = [];

    constructor(private umService: UserManagementService, private userService: UserService) { }

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }
    onSubmit() {
        // If user is RI internal user then distributor ID should be set to empty
        if (this.user.isRiInternal || this.userDetails.Role === 'Distributor Admin') {
          this.user.DistributorMasterID = '';
        }
        this.onSaveUser.emit(this.user);
    }
    OnCancelClick() {
        this.closeNewUser.emit();
    }

    ngOnInit() {
      this.userDetails = this.userService.getUser() || {};
      if (this.userDetails.Role === 'DSD Admin') {
        this.umService.getRoles().subscribe((response) => {
            this.roles = response;
            if (this.isNewUser) {
              this.user.RoleID = response[0].LookupID;
            }
        });

        this.umService.getDistributerAndCopacker().subscribe((response) => {
            this.distributorsAndCopackers = response;
            if (this.isNewUser) {
              this.user.DistributorMasterID = response[0].DistributorCopackerID;
            }
        });
        this.umService.getBranches().subscribe((response) => {
          this.branches = response;
          if (this.isNewUser) {
            this.user.BranchID = response[0].BranchID;
          }
        });
       }
    }
}
