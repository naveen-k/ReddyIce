import { LocalDataSource } from 'ng2-smart-table';
import { UserTablesService } from '../../user-management.service';
import { Component } from '@angular/core';
import { User } from '../../user-management.interface';

@Component({
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
    isNewCustomer: boolean = false;
    selectedUser = {};
    newUser: any;
    showNewCustomer(newCustomer) {
        // this.isNewCustomer = newCustomer;
        this.isNewCustomer = !this.isNewCustomer;
        this.newUser = <User>{
          fname: '',
          lname: '',
          username: '',
          email: '',
          phone: '',
          role: 'Driver',
          branch: '305',
          isActive: false,
          availableBranches: ['301', '301', '303', '304', '305'],
          availableRoles: ['Admin', 'Driver'],
          availableDistributor: ['Dist-001', 'Dist-002'],
          distributor: 'Dist-002',
          isSeasonal: true,
          isRiInternal: false,
        };
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

    smartTableData: any;
    constructor(private service: UserTablesService) {
        // this.service.getData().then((data) => {
        //     data.forEach(element => {
        //         element['name'] = `${element.fname} ${element.lname}`;
        //     });
        //     this.source.load(data);
        // });
        this.smartTableData = service.dataTableData;
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
      this.smartTableData.push(user);
      this.isNewCustomer = !this.isNewCustomer;
    }

    ngOnInit() {
        this.service.getUsers().subscribe((res) => {
            debugger;
        })
    }

}
