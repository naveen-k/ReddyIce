import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log("hello");
    // Just to make sure `auth_token` is clear when, landed on this page
   
  }

  
}
