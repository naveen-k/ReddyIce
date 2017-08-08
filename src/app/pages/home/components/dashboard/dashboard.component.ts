import { HomeService } from '../../home.service';

import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';


@Component({
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})

export class DashboardComponent implements OnInit {

  settings = {
    add: {
      addButtonContent: '',
    },
    hideSubHeader : true,
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true,
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      routeNumber: {
        title: 'Route#',
        type: 'number',
      },
      driverName: {
        title: 'Driver Name',
        type: 'string',
      },
      numberOfTickets: {
        title: '# Of Tickets',
        type: 'number',
      },
      amount: {
        title: 'Amount',
        type: 'number',
      },
    },
  };

  dataSource: LocalDataSource = new LocalDataSource();

  data: any;

  constructor(private homeService: HomeService) {
    
  }

  ngOnInit() {
    this.data = this.homeService.getAll();
    this.homeService.getData().then((_data) => {      
      this.dataSource.load(_data);
    });
  }

  getResponsive(padding, offset) {
    return this.homeService.getResponsive(padding, offset);
  }
}
