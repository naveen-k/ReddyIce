import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { fadeInAnimation } from '../../_animations/index';
@Component({
  selector: 'registration',
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class Registration implements OnInit {
  groupVal: number = 0;
  regiForm: FormGroup;
  CustomerNumber: Number;
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router) { 
        // To initialize FormGroup  
        this.regiForm = fb.group({  
          'CustomerNumber' : [null, Validators.required] 
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
