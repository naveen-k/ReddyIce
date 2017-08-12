import { LocalDataSource } from 'ng2-smart-table';
import { UserTablesService } from '../../user-management.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { User } from '../../user-management.interface';

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
        // this.isNewCustomer = newCustomer;
        this.isNewCustomer = !this.isNewCustomer;
        this.hideColumn = !this.hideColumn;
        this.newUser = <User>{
          FirstName: '',
          LastName: '',
          UserName: '',
          EmailID: '',
          Phone: '',
          role: 'Driver',
          branch: '305',
          IsActive: false,
          availableBranches: ['301', '301', '303', '304', '305'],
          availableRoles: ['Admin', 'Driver'],
          availableDistributor: ['Dist-001', 'Dist-002'],
          distributor: 'Dist-002',
          isSeasonal: true,
          isRiInternal: false,
        };
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize(event) {
      if (event.target.innerWidth > 778 && event.target.innerWidth < 1010) {
      console.log("Width: " + event.target.innerWidth);
        this.hideColumn = true;
      }
    }
    settings = {
        mode: 'external',
        add: {
            addButtonContent: '',
        },
        edit: {
            editButtonContent: '<i class="ion-edit"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmEdit: true,
        },
        actions: {
            delete: false,
        },
        hideSubHeader : true,
        delete: {
            deleteButtonContent: '<i class="ion-trash-a"></i>',
            confirmDelete: true,
        },
        editable: false,
        columns: {
            name: {
                title: 'Name',
                type: 'string',
            },
            role: {
                title: 'Role',
                type: 'string',
            },

        }
    };

    source: LocalDataSource = new LocalDataSource();

    userTableData: User[];
    constructor(private service: UserTablesService) {
        // this.service.getData().then((data) => {
        //     data.forEach(element => {
        //         element['name'] = `${element.fname} ${element.lname}`;
        //     });
        //     this.source.load(data);
        // });
       // this.userTableData = service.dataTableData;
    }

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
      //this.userTableData.push(user);
      this.service.createUser(user).subscribe((res) => {
        console.log('success', JSON.stringify(res));
      });
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
