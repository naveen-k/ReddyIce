import { AfterViewInit, Component, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Routes } from '@angular/router';
import { GlobalState } from './global.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  mode = 'over';
  title = 'app';

  options: any = {
    position: ['bottom', 'right'],
    timeOut: 5000,
    lastOnBottom: true,
  };
  constructor(

    private activatedRoute: ActivatedRoute,
    private router: Router) {
      
  }
  ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
   
  }
  goToPage(pagename){
    console.log("pagename ",pagename);
    this.router.navigateByUrl('/'+pagename);
  }
}
