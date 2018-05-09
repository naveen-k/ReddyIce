import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { slideInOutAnimation } from '../../_animations/index';

@Component({
  selector: 'change-password',
  templateUrl: './changePassword.html',
  styleUrls: ['./changePassword.scss'],
  animations: [slideInOutAnimation],
  host: { '[@slideInOutAnimation]': '' }
})
export class ChangePassword implements OnInit {
  changePasswordForm: FormGroup;
  CustomerNumber: Number;
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router) { 
        // To initialize FormGroup  
        this.changePasswordForm = fb.group({  
          'oldPassword' : [null, Validators.required],          
          'newPassword' : [null, Validators.required],
          'confirmPassword' : [null, Validators.required]
        }); 
  }
  ngOnInit() {
    console.log("Login");
    // Just to make sure `auth_token` is clear when, landed on this page

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
