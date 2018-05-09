import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../_animations/index';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'history',
  templateUrl: './history.html',
  styleUrls: ['./history.scss'],
  animations: [slideInOutAnimation],
  host: { '[@slideInOutAnimation]': '' }
})
export class History implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) { }
    cartData:Array<any>;
  ngOnInit() {
    console.log("hello");
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
  goToPage(pagename){

      this.router.navigateByUrl('/'+pagename);
  
    
  }
  
}
