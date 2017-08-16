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

    constructor(private activeModal: NgbActiveModal) {
    }

    ngOnInit() { }

    closeModal() {
        this.activeModal.close();
    }

    dismiss() {
        this.activeModal.dismiss('cancel');
    }
}
