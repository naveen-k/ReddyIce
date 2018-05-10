import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar} from '@angular/material';
import { slideInOutAnimation } from '../../_animations/index';
@Component({
  selector: 'feedback',
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.scss'],
  animations: [slideInOutAnimation],
  host: { '[@slideInOutAnimation]': '' }
})
export class Feedback implements OnInit {
  feedbackForm: FormGroup;
  CustomerNumber: Number;
  category:Array<any>;
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router,private snackBar: MatSnackBar) { 
        // To initialize FormGroup  
        this.feedbackForm = fb.group({  
          'Rating' : [null, Validators.required],
          'Category' : [null, Validators.required],
          'Comments' : [null, Validators.required]
        }); 
  }
  ngOnInit() {

    // Just to make sure `auth_token` is clear when, landed on this page
    this.category = [
      {value: '0', viewValue: 'Delivery Question'},
      {value: '1', viewValue: 'Management'},
    ];
  }
  // Executed When Form Is Submitted  
  onFormSubmit(form:NgForm)  
  {  this.snackBar.open("Error","Fedback Failed", {
    duration: 2000,
  });
    console.log(form);  
  }
  goToPage(pagename){
    this.router.navigateByUrl('/'+pagename);
  }
}
