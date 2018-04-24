import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'registration',
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss']
})
export class Registration implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log("Registration");
    // Just to make sure `auth_token` is clear when, landed on this page
   
  }

  
}
