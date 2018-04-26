import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  loginForm: FormGroup;
  CustomerNumber: Number;
  constructor(private fb: FormBuilder) { 
        // To initialize FormGroup  
        this.loginForm = fb.group({  
          'UserName' : [null, Validators.required],
          'Password' : [null, Validators.required]
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
  
}
