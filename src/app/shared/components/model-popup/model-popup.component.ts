import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    styleUrls: [('./model-popup.component.scss')],
    templateUrl: './model-popup.component.html',
})

export class ModelPopupComponent implements OnInit {

    BUTTONS = { OK: 'OK', Cancel: 'Cancel' };
    showCancel: boolean = false;
    modalHeader: string;
    modalContent: any[] = [];

    closeModalHandler: Function;
    dismissHandler: Function;
    constructor(private activeModal: NgbActiveModal) {
    }

    ngOnInit() { }

    closeModal() {
        this.activeModal.close();
        if (this.closeModalHandler) {
            this.closeModalHandler();
        }
    }

    dismiss() {
        this.activeModal.dismiss('cancel');
        if (this.dismissHandler) {
            this.dismissHandler();
        }
    }
}
