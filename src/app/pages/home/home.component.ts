import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log("hello");
    // Just to make sure `auth_token` is clear when, landed on this page
   
  }

  
}
