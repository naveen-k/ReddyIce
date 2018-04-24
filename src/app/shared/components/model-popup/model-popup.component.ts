import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    styleUrls: [('./model-popup.component.scss')],
    templateUrl: './model-popup.component.html',
})

export class ModelPopupComponent implements OnInit {

    BUTTONS = { OK: 'OK', Cancel: 'Cancel' };
    showCancel: boolean = false;
    modalHeader: string;
    modalContent: any[] = [];
    modeltype:string = 'branch';

    closeModalHandler: Function;
    dismissHandler: Function;
    deleteTicketHandler:Function;
    constructor(private activeModal: NgbActiveModal,private router:Router,) {
    }

    ngOnInit() { }

    closeModal() {
        
        this.activeModal.close();
        if (this.closeModalHandler) {
            this.closeModalHandler();
        }
    }

    dismiss(link:string='') {
        if(link){
            this.router.navigate([link]);
        }
        this.activeModal.dismiss('cancel');
        if (this.dismissHandler) {
            this.dismissHandler();
        }
    }
    delete(ticketId:string='') {
        
        this.activeModal.close();
        if (this.deleteTicketHandler) {
            this.deleteTicketHandler(ticketId);
        }
    }

}
