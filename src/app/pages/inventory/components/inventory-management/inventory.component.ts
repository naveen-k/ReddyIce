import { Observable } from 'rxjs/Rx';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../user-management/user-management.interface';
import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../../../../shared/user.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

import { NgModule } from '@angular/core';

@Component({
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
    linkRpt: SafeResourceUrl;
	title:string = "Inventory";
	user: User;
	userid:number;
	constructor(private sanitizer: DomSanitizer,
		private userService: UserService ) {
			this.user = this.userService.getUser();
				this.linkRpt = sanitizer.bypassSecurityTrustResourceUrl(environment.inventoryEndpoint + `?LoggedInUserID=${this.user.UserId}`);
		
	}
	 
	ngOnInit() {
		// this.user = this.userService.getUser();
		// userid=this.user.UserId;
		// console.log(userid);
	}
	
}
