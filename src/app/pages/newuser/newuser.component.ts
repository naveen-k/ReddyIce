import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'newuser',
  templateUrl: './newuser.html',
  styleUrls: ['./newuser.scss']
})
export class NewUser implements OnInit {
  newUserForm: FormGroup;
  CustomerNumber: Number;
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router) { 
        // To initialize FormGroup  
        this.newUserForm = fb.group({  
          'FullName' : [null, Validators.required],
          'Mobile' : [null, Validators.required],
          'Email' : [null, Validators.required],
          'BusinessName' : [null, Validators.required],
          'StoreNumber' : [null, Validators.required],
          'DeliveryAddress' : [null, Validators.required],
          'City' : [null, Validators.required],
          'State' : [null, Validators.required],
          'ZipCode' : [null, Validators.required]
        }); 
  }
  ngOnInit() {

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
