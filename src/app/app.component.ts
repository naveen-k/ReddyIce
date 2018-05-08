import { AfterViewInit, Component, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Routes } from '@angular/router';
import { GlobalState } from './global.state';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {PopupComponent} from './shared/components/popup/popup.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  mode = 'over';
  title = 'app';
  popupData:any ={};
  options: any = {
    position: ['bottom', 'right'],
    timeOut: 5000,
    lastOnBottom: true,
  };
  constructor(

    private activatedRoute: ActivatedRoute,
    private router: Router,public dialog: MatDialog) {
      
  }
  ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
   
  }
  goToPage(pagename){
    console.log("pagename ",pagename);
    if(pagename =='pages/quickorder/success'){
      this.openDialog(pagename);
    } else {
      this.router.navigateByUrl('/'+pagename);
    }
    
  }
  quickOrderConfirmation(){

  }
  openDialog(pagename): void {
    let dialogRef = this.dialog.open(PopupComponent, {
      width: '250px',
      data: {cancelButtonTitle:"No",okButtonTitle:"Yes", title: "Quick Order", details: "Would you like to submit your order." }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result){
        this.router.navigateByUrl('/'+pagename);
      }
     
    });
  }
}
