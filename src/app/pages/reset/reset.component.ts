import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'reset',
  templateUrl: './reset.html',
  styleUrls: ['./reset.scss']
})
export class Reset implements OnInit {
  groupVal: number = 0;
  resetForm: FormGroup;
  CustomerNumber: Number;
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router) { 
        // To initialize FormGroup  
        this.resetForm = fb.group({  
          'Password' : [null, Validators.required],
          'ConfirmPassword' : [null, Validators.required] 
        }); 
  }
  ngOnInit() {

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
