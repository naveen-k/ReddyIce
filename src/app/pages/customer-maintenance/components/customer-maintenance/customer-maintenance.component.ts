import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { any } from 'codelyzer/util/function';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';


@Component({
    templateUrl: './customer-maintenance.component.html',
    styleUrls: ['./customer-maintenance.component.scss'],
	
})
export class CustomerMaintenanceComponent implements OnInit {
	filter: any = {
		startDate: null,
		todaysDate: null,
		endDate: null,
		requestType:'SRP',
		requestStatus:'all'
	};
	buttonAction:boolean = false;
	constructor( private route: ActivatedRoute) {}
	
	ngOnInit() {
		const now = new Date();
        this.filter.startDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.endDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        this.filter.todaysDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
	}

refreshDataHandler(byType: any = ''){
	if( byType ==='dateChange' ){
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
console.log(this.filter);
	}

}