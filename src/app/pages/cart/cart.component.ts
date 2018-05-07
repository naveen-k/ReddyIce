import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'add-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart implements OnInit {
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
        title : 'Add to cart'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Add to cart'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Add to cart'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Add to cart'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Add to cart'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Add to cart'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Add to cart'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Add to cart'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Add to cart'
      },
      {
        mode : 1,
        img : 'assets/img/cart/card1.jpg',
        title : 'Add to cart'
      },
      {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Add to cart'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Add to cart'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Add to cart'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Add to cart'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Add to cart'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Add to cart'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Add to cart'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Add to cart'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Add to cart'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Add to cart'
    },
    {
      mode : 1,
      img : 'assets/img/cart/card1.jpg',
      title : 'Add to cart'
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
