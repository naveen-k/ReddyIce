import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar} from '@angular/material';
@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  loginForm: FormGroup;
  CustomerNumber: Number;
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router,private snackBar: MatSnackBar) { 
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
  {  this.snackBar.open("Error","Invalide user credential.", {
    duration: 2000,
  });
    console.log(form);  
  }
  goToPage(pagename){
    this.router.navigateByUrl('/'+pagename);
  }
}
