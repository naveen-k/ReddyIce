import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { fadeInAnimation } from '../../../_animations/index';
@Component({
  selector: 'newuser',
  templateUrl: './newuser.html',
  styleUrls: ['./newuser.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class NewUserRegistration implements OnInit {
  newUserForm: FormGroup;
  CustomerNumber: Number;
  isIE:boolean = false;
  color = 'primary';
  checked = false;
  disabled = false;
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router) { 
        // To initialize FormGroup  
        this.newUserForm = fb.group({  
          'FullName' : [null, Validators.required],
          'Mobile' : [null, Validators.required],
          'Email' : [null, Validators.required],
          'StoreName' : [null, Validators.required],
          'Address' : [null, Validators.required],
          'City' : [null, Validators.required],
          'State' : [null, Validators.required],
          'ZipCode' : [null, Validators.required]
        }); 
  }
  ngOnInit() {
    
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    var edge = ua.indexOf('Edge/');
    if (msie > 0 || trident>0 || edge>0) {
      this.isIE = true; 
    } else {
      this.isIE = false; 
    }
    console.log( ">>>>>>>>>>>>>>>>>>>>>>> ",this.isIE);
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
