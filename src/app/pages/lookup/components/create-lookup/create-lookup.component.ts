import { Observable } from 'rxjs/Rx';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../user-management/user-management.interface';
import { environment } from '../../../../../environments/environment.prod';
import { Component, OnInit, AfterContentInit, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../../../../shared/user.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { LookupService } from '../../lookup.service';
import { selector } from 'rxjs/operator/multicast';
import { any } from 'codelyzer/util/function';
import { NgModule } from '@angular/core';
import { ModelPopupComponent } from '../../../../shared/components/model-popup/model-popup.component';

@Component({
    templateUrl: './create-lookup.component.html',
	selector: 'create-lookup',
	styleUrls: ['./create-lookup.component.scss'],
})
export class CreateLookupComponent implements OnInit {
	private _lookupItem:any;
	private _matchedlookup:any;
    
	isFormValid: boolean = true;
    
	
	@Input() formIsDirty: boolean;
	@Input() isNewLookup:boolean;
	@Input() action:string = "";
	@Output() onUpdatelookupItem: EventEmitter<any> = new EventEmitter();
	@Output() onSavelookupItem: EventEmitter<any> = new EventEmitter();
	constructor(private _service: LookupService) {}
    ngOnInit() {
    }
	
	@Input()
	get matchedlookup(): any {
		return this._matchedlookup;
	}
	
	set matchedlookup(val: any) {
        if (!Object.keys(val).length) {
            return;
        }
		this._matchedlookup = val;
		
	}
	
	@Input()
    get lookupItem(): any {
        return this._lookupItem;
    }
    set lookupItem(val: any) {
        if (!Object.keys(val).length) {
            return;
        }
		this._lookupItem = val;
	}

	capitalizeFirst(value): string {
    if (value === null) return 'Not assigned';
    return value.charAt(0).toUpperCase() + value.slice(1);
}
	changeHandler(lookupItem){
		lookupItem.Value = this.capitalizeFirst(lookupItem.Value);
	}
	onSubmit() {
		
		if(this.isNewLookup){
		this.lookupItem.LookUpDefinationId = this.matchedlookup.LookUpDefinationId;
		this.lookupItem.LookupDefinition = this.lookupItem.Text;
		this.lookupItem.Text2 = this.lookupItem.Text;
		this.lookupItem.LookUpId = 0;
		this.lookupItem.IsEditable = 1;
		this.lookupItem.Type = this.matchedlookup.Type; 
	}
		
		this.isNewLookup ? this.onSavelookupItem.emit(this.lookupItem) : this.onUpdatelookupItem.emit(this.lookupItem);
	
		//this.onUpdatelookupItem.emit(this.lookupItem);
	}
	
}
