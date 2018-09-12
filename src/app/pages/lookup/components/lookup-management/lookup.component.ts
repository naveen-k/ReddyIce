import { Observable } from 'rxjs/Rx';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../user-management/user-management.interface';
import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../../../../shared/user.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { LookupService } from '../../lookup.service';
import { selector } from 'rxjs/operator/multicast';
import { any } from 'codelyzer/util/function';
import { NgModule } from '@angular/core';
import { ModelPopupComponent } from '../../../../shared/components/model-popup/model-popup.component';


@Component({
    templateUrl: './lookup.component.html',
    styleUrls: ['./lookup.component.scss'],
	
})
export class LookupComponent implements OnInit {
	rightCardOpen: boolean = false;
	cardTitle: string;
	action: string = '';
	title:string = "Lookup Management";
	lookuptypes:any[];
	lookupoptions:any[];
	matchedlookupType:any = 0;
	lookupStatus: string = 'Active';
	test:any;
	idDataLoaded:boolean = false;
	isNewLookup: boolean = false;
	newlookupItem:any = {};
	constructor(private _service: LookupService,private notification: NotificationsService, private modalService: NgbModal) {}
	
	ngOnInit() {
		this._service.getlookuptypes().subscribe((res) => {
			this.lookuptypes = res;
			this.lookuptypes.sort((a, b) => {
				if (a.ValueLabel < b.ValueLabel) return -1;
				else if (a.ValueLabel > b.ValueLabel) return 1;
				else return 0;
			  });
		});
	}
	changeLookupTypeHandler(){
			if(!this.matchedlookupType){
				this.idDataLoaded = false;
			}else{
				this._service.getlookuptypedetail(this.matchedlookupType.LookUpDefinationId).subscribe((response) => {
					this.lookupoptions = response;
					this.lookupoptions = this.lookupoptions.filter((l) => {
						
						  if (this.lookupStatus === 'Active') {
							return l.Status;
						  }
						  if (this.lookupStatus === 'InActive') {
							return !l.Status;
						  }
						  return true;
					});
					this.lookupoptions.sort((a, b) => {
						if (a.Value < b.Value) return -1;
						else if (a.Value > b.Value) return 1;
						else return 0;
					  });
					this.idDataLoaded = true;
				  
					
				});
				
			}
				
		
		
	}
	onEditClicked(lookupItem) {
		this.newlookupItem = Object.assign({}, lookupItem);
		this.action = 'edit';
		this.cardTitle = 'Edit Lookup Item';
		this.isNewLookup = false;
		if (!this.rightCardOpen) {
		this.rightCardOpen = !this.rightCardOpen;

		}
	
	}
	showNewLookup(newLookup) {
		this.action = 'create';
		this.isNewLookup = true;
		this.rightCardOpen = true;
		this.cardTitle = 'Create New Lookup Item';
		this.newlookupItem = {
		LookUpDefinationId:'',
		LookUpId:'',
		LookupDefinition:'',
		ReturnMsg:'',
		Status:this.action === 'create' ? true : false,
		Text:'',
		Text2:'',
		Type:'',
		Value:'',
		};
		if(this.action === 'create' && document.forms['lookUpForm']){
		 document.forms['lookUpForm'].reset();
		
		}
    }
	closeRightCard() {
		
		  this.rightCardOpen = !this.rightCardOpen;
		  this.isNewLookup = false;
		
	  }
deleteLookupItem(lookupItem){
	
	const activeModal = this.modalService.open(ModalComponent, {
		size: 'sm',
		backdrop: 'static',
	});
	activeModal.componentInstance.BUTTONS.OK = 'OK';
	activeModal.componentInstance.showCancel = true;
	activeModal.componentInstance.modalHeader = 'Warning!';
	activeModal.componentInstance.modalContent = 'Are you sure you want to delete this lookup item?';
	activeModal.componentInstance.closeModalHandler = (() => {
		lookupItem.Status = 0;
		this._service.updatelookupItem(lookupItem, lookupItem.LookUpId).subscribe((res) => {
			this.changeLookupTypeHandler();
			this.notification.success('Success', 'Lookup Item deleted successfully');
			this.rightCardOpen = false;
			this.isNewLookup = false;
		},
		(error) => {
			error = JSON.parse(error._body);
			this.notification.error('Error', error.Message);
			}
		);
	});
}
onUpdatelookupItem(lookupItem) {
	
	this._service.updatelookupItem(lookupItem, lookupItem.LookUpId).subscribe((res) => {
		this.changeLookupTypeHandler();
		this.notification.success('Success', 'Lookup Item updated successfully');
		this.rightCardOpen = !this.rightCardOpen;
		this.isNewLookup = false;
	},
	(error) => {
		error = JSON.parse(error._body);
		this.notification.error('Error', error.Message);
	}
	);
}

onSavelookupItem(lookupItem) {
	this.lookupStatus = 'Active';
	this._service.createlookupItem(lookupItem).subscribe((res) => {
	  
	  this.changeLookupTypeHandler();
	  
      this.notification.success('Success', 'Lookup Item  created successfully');
      this.rightCardOpen = !this.rightCardOpen;
		this.isNewLookup = false;

    },
      (error) => {
        error = JSON.parse(error._body);
        this.notification.error('Error', error.Message);
      });
	  
	  }
	

}