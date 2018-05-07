import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {PopupComponent} from '../../shared/components/popup/popup.component';
@Component({
  selector: 'forgot-password',
  templateUrl: './forgotPassword.html',
  styleUrls: ['./forgotPassword.scss']
})
export class ForgotPassword implements OnInit {
  groupVal: number = 0;
  popupData:any ={};
  forgotPasswordForm: FormGroup;
  CustomerNumber: Number;
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router,public dialog: MatDialog) { 
        // To initialize FormGroup  
        this.forgotPasswordForm = fb.group({  
          'email' : ['', [Validators.required, Validators.email]]
        }); 
  }
  ngOnInit() {
    console.log(this.forgotPasswordForm.controls.email.hasError)
  }
  getGroupValue(val) {
    this.groupVal = val;
  }
  // Executed When Form Is Submitted  
  onFormSubmit(form:NgForm)  
  {  
    console.log(form);  
    this.openDialog();
  }
  goToPage(pagename){
    this.router.navigateByUrl('/'+pagename);
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(PopupComponent, {
      width: '250px',
      data: {cancelButtonTitle:"OK", title: "Forgot Password", details: "Password has been sent to your register email address." }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.popupData = result;
    });
  }
}
