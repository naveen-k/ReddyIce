import { forEach } from '@angular/router/src/utils/collection';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../shared/user.service';
import { selector } from 'rxjs/operator/multicast';
import { LocalDataSource } from 'ng2-smart-table';
import { UserManagementService } from '../../user-management.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../user-management.interface';
import { any } from 'codelyzer/util/function';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ModelPopupComponent } from '../../../../shared/components/model-popup/model-popup.component';
//import * as moment from 'moment';

@Component({
    templateUrl: './handhelduserhistory.component.html',
    selector: 'handhelduserhistory',
	styleUrls: ['./handhelduserhistory.component.scss'],
})
export class HandheldUserHistoryComponent implements OnInit {
	private _loggedUserdata: any;
	//IsCCPayment:boolean;
	//IsClosed:boolean;
	actionstatus:boolean = false;
	userActivityLog:any = {};
	@Input() userid: number; 
	@Input() actionName : string;
	@Output() forceLogOut: EventEmitter<any> = new EventEmitter();
	@Input() 
	get loggedUserdata(): any {
		return this._loggedUserdata;
	}
	
	set loggedUserdata(val: any) {
		
        if (!Object.keys(val).length) {
            return;
        }
		if(this.actionName === 'view'){
			this.actionstatus = true;
		}else{
			this.actionstatus = false;
		}
		//this.IsCCPayment = val.IsCCPayment;
		//this.IsClosed = val.IsClosed;
		this.userActivityLog = val.userActivityLog;
		
		console.log(val);
		this._loggedUserdata = val;
		
	}
	
	
	constructor( private umService: UserManagementService, private notification: NotificationsService, private modalService: NgbModal) {
		
	}
	
    ngOnInit() { }
	killprocess(loggedUser){
		console.log(loggedUser);
		/*const activeModal = this.modalService.open(ModalComponent, {
			size: 'sm',
			backdrop: 'static',
		});
	let trip_date = new Date(loggedUser.LoginDate);
		let tripdate = (trip_date.getMonth() + 1) + '/' + trip_date.getDate() + '/' +  trip_date.getFullYear();*/
	/*if(!this.IsClosed && this.IsCCPayment){
		activeModal.componentInstance.BUTTONS.OK = 'OK';
		activeModal.componentInstance.showCancel = false;
		activeModal.componentInstance.modalHeader = 'Warning!';
		activeModal.componentInstance.modalContent = 'There is an open trip found on ' + tripdate + ' and Can not kill this user session, there is an open trip with CC transaction';
		
	}else if(!this.IsClosed){
		
		activeModal.componentInstance.BUTTONS.OK = 'OK';
		activeModal.componentInstance.showCancel = true;
		activeModal.componentInstance.modalHeader = 'Warning!';
		activeModal.componentInstance.modalContent = 'There is an open trip found on ' + tripdate +  ' Date';
		activeModal.componentInstance.closeModalHandler = (() => {
			this.umService.Killhistory(loggedUser.UserActivityLogID,loggedUser).subscribe((res) => {
			this.notification.success('Success', 'Session has killed successfully.');
		
			},(error) => {
				error = JSON.parse(error._body);
				this.notification.error('Error', error.Message);
			});
		});
	}else{*/
	this.forceLogOut.emit(loggedUser);
		/*this.umService.Killhistory(loggedUser.UserActivityLogID,loggedUser).subscribe((res) => {
			
			
			this.notification.success('Success', 'User session has been logged out successfully.');
		
			},(error) => {
				error = JSON.parse(error._body);
				this.notification.error('Error', error.Message);
			});*/
	//}
		
 }
}