import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pages } from '../../../pages/pages.component';
@Component({
    selector: 'pagination',
    template: `
        <nav aria-label="Page navigation example" [hidden]="_tableData.length<=options.itemPerPage">
        <div class="row"> 
        <div class='' style="padding: 10px;"> 
            Records {{options.start}} - {{options.end}} of {{_tableData.length}}
        </div>
          <ul class="pagination justify-content-end ">
            <li class="page-item" [ngClass]="{'disabled':currentPageIndex==1}">
              <a class="page-link" (click)="pageChangeHandler(currentPageIndex-1)" href="javascript:void(0);">
                <i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            </li>
            <li *ngFor="let a of options.pages; let i = index" class="page-item"
             [ngClass]="{'btn-danger': i+1 == currentPageIndex}" [hidden]="!showPages">
                <a class="page-link" (click)="pageChangeHandler(i+1, 2)">{{i+1}}</a>
            </li>
            <li class="page-item" [ngClass]="{'disabled':currentPageIndex==options.pages.length}">
              <a class="page-link" (click)="pageChangeHandler(currentPageIndex+1)" href="javascript:void(0);">
                <i class="fa fa-chevron-right" aria-hidden="true"></i></a>
            </li>
          </ul>
          </div>
        </nav>
    `,
})
export class PaginationComponent {

    currentPageIndex: number = 1;
    _tableData = [];

    @Input()
    showPages: boolean = true;

    @Input()
    set tableData(data) {
        if (!data) { return; }
        this._tableData = data;
        this.setPagination();
        this.currentPageIndex = 1;
        this.pageChangeHandler(this.currentPageIndex);
    }

    get tableData(): any[] {
        return this._tableData;
    }

    @Input()
    options: any = {
        itemPerPage: 15,
        pages: [],
        start: 0,
        end: 0,
    };

    @Input()
    currentPage: any;

    @Output()
    currentPageChange = new EventEmitter();

    pageChangeHandler(page) {
        setTimeout(() => {
            this.currentPageIndex = page;
            this.currentPage = this._tableData.slice((page - 1) * this.options.itemPerPage, page * this.options.itemPerPage);
            this.currentPageChange.emit(this.currentPage);
            this.options.start = ((this.currentPageIndex - 1) * this.options.itemPerPage + 1);
            const end = (this.currentPageIndex * this.options.itemPerPage);
            this.options.end = end > this._tableData.length ? this._tableData.length : end;
        });
    }

    setPagination() {
        this.options.pages = new Array(Math.ceil(this._tableData.length / this.options.itemPerPage));
    }

}
