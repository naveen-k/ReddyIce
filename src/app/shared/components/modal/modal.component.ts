import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    styleUrls: [('./modal.component.scss')],
    templateUrl: './modal.component.html',
})

export class ModalComponent implements OnInit {

    BUTTONS = { OK: 'OK', Cancel: 'Cancel' };
    showCancel: boolean = false;
    modalHeader: string;
    modalContent: string = `modal content`;

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
