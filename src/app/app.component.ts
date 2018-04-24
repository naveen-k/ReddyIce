import { AfterViewInit, Component, ViewContainerRef } from '@angular/core';
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
  ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
   
  }
}
