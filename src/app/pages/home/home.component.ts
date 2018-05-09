import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../_animations/index';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  animations: [slideInOutAnimation],
  host: { '[@slideInOutAnimation]': '' }
})
export class Home implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    console.log("hello");
    // Just to make sure `auth_token` is clear when, landed on this page
   
  }
  goToPage(pagename){

      this.router.navigateByUrl('/'+pagename);
  
    
  }
  
}
