// import { ViewChild } from '@angular/core/src/metadata/di';
import { DualListItem } from '../../interfaces/interfaces';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
@Component({
    selector: 'dual-list',
    templateUrl: 'dual-list.component.html',
    styleUrls: ['dual-list.component.scss']
})
export class DualListComponent implements OnInit {

    @Input() mappedRowTemplate: ViewChild

    @Input()
    items: DualListItem[] = [];

    @Output()
    itemsChange: EventEmitter<any[]> = new EventEmitter();

    @Input()
    selectedItems: DualListItem[] = [];

    @Output()
    selectedItemsChange: EventEmitter<any[]> = new EventEmitter();

    ngOnInit() {
        // TODO - filterout selected items
    }

    rightClick() {
        this.items = this.items.filter((element) => {
            if (element.selected) {
                element.selected = false;
                this.selectedItems.push(element);
                return false;
            }
            return true;
        });
        this.selectedItemsChange.emit(this.selectedItems);
    }

    leftClick() {
        this.selectedItems = this.selectedItems.filter((element) => {
            if (element.selected) {
                element.selected = false;
                this.items.push(element);
                return false;
            }
            return true;
        });
        this.selectedItemsChange.emit(this.selectedItems);
    }

}