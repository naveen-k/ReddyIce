import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { slideInOutAnimation } from '../../_animations/index';
@Component({
  selector: 'product',
  templateUrl: './product.html',
  styleUrls: ['./product.scss'],
  animations: [slideInOutAnimation],
  host: { '[@slideInOutAnimation]': '' }
})
export class Product implements OnInit {
  groupVal: number = 0;
  regiForm: FormGroup;
  CustomerNumber: Number;
  cartData : Array<any> =[];
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
    this.cartData = [
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Product 1'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Product 2'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Product 3'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Product 4'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Product 5'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Product 6'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Product 7'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Product 8'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Product 9'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Product 10'
      },
      {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Product 11'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Product 12'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Product 13'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Product 14'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Product 15'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Product 16'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Product 17'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Product 18'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Product 19'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Product 20'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Product 21'
    }
  ]
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
