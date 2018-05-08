import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatFormFieldModule} from '@angular/material';
@Component({
    selector: 'contactus',
    templateUrl: 'contactus.component.html',
    styleUrls: ['contactus.component.scss']
})
export class ContactusComponent {
    constructor(
        public dialogRef: MatDialogRef<ContactusComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }
    
      onCancelClick(): void {
        this.dialogRef.close();
      }
}