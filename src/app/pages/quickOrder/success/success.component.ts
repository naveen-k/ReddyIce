import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import {ContactusComponent} from '../../contactus/contactus.component';
@Component({
  selector: 'quick-order-success',
  templateUrl: './success.html',
  styleUrls: ['./success.scss']
})
export class Success implements OnInit {
  groupVal: number = 0;
  popupData:any ={};
  successForm: FormGroup;
  CustomerNumber: Number;
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router,public dialog: MatDialog) { 
        // To initialize FormGroup  
        this.successForm = fb.group({  
          'OTP' : [null, Validators.required] 
        }); 
  }
  ngOnInit() {
    this.groupVal = 0;
    console.log("Registration", this.groupVal);
    // Just to make sure `auth_token` is clear when, landed on this page

  }
  getGroupValue(val) {
    this.groupVal = val;
  }
  // Executed When Form Is Submitted  
  onFormSubmit(form:NgForm)  
  {  
    console.log(form);  
  }
  goToPage(pagename){
    this.router.navigateByUrl('/'+pagename);
  }
  openContactUs():void{
    let dialogRef = this.dialog.open(ContactusComponent, {
      width: '60%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.popupData = result;
    });
  }
}
