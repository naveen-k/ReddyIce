import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {

    linkRpt: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {
        this.linkRpt = sanitizer.bypassSecurityTrustResourceUrl("http://frozen.reddyice.com/POCREeports/Default");
    }
}
