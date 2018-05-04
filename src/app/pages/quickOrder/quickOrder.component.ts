import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'quick-order',
  templateUrl: './quickOrder.html',
  styleUrls: ['./quickOrder.scss']
})
export class QuickOrder implements OnInit {
  groupVal: number = 0;
  quickOrderForm: FormGroup;
  CustomerNumber: Number;
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router) { 
        // To initialize FormGroup  
        this.quickOrderForm = fb.group({  
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
}
