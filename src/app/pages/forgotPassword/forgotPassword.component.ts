import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'forgot-password',
  templateUrl: './forgotPassword.html',
  styleUrls: ['./forgotPassword.scss']
})
export class ForgotPassword implements OnInit {
  groupVal: number = 0;
  forgotPasswordForm: FormGroup;
  CustomerNumber: Number;
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router) { 
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
  }
  goToPage(pagename){
    this.router.navigateByUrl('/'+pagename);
  }
}
