import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { any } from 'codelyzer/util/function';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CustomerMaintenanceService } from '../../customer-maintenance.service';


@Component({
    templateUrl: './customer-maintenance.component.html',
    styleUrls: ['./customer-maintenance.component.scss'],
	
})
export class CustomerMaintenanceComponent implements OnInit {
	filter: any = {
		startDate: null,
		todaysDate: null,
		endDate: null,
		requestType: '0',
		requestStatus: '0'
	};
	buttonAction: boolean = false;
	requestTypes = [];
	status = [];
	requests = [];
	constructor( private route: ActivatedRoute,
		private custMaintenanceService: CustomerMaintenanceService) {}
	
	ngOnInit() {
		const now = new Date();
        this.filter.startDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.endDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
		
		this.custMaintenanceService.getRequestType()
			.subscribe((resp) => this.requestTypes = resp);
		
		this.custMaintenanceService.getStatus()
			.subscribe((resp) => this.status = resp);
		
		this.custMaintenanceService.getAllRequests()
			.subscribe((resp) => this.requests = resp);
	}

	refreshDataHandler(byType: any = ''){
		if( byType === 'dateChange' ){
				//this.dateChangeHandler();
		}
	}
	dateChangeHandler() {
		
	}
	modifyDate(modifyDate) {
        if (!modifyDate.year) { return ''; }
        let yy = modifyDate.year, mm = modifyDate.month, dd = modifyDate.day;
        if (mm < 10) { mm = '0' + mm }
        if (dd < 10) { dd = '0' + dd }
        return yy + '/' + mm + '/' + dd;
	}
	
	getRequestList(){
		this.filter.modifystartDate = this.modifyDate(this.filter.startDate);
		this.filter.modifyendDate = this.modifyDate(this.filter.endDate);
		// console.log(this.filter);
	}

}