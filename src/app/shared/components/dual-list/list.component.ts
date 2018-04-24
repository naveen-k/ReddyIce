import { DualListItem } from '../../interfaces/interfaces';
import { Component, Input, ViewChild } from '@angular/core';
@Component({
    selector: 'list',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.scss']
})
export class ListComponent {

    @Input() rowTemplate: ViewChild;

    @Input() heading: string = 'Items';

    @Input()
    items: DualListItem[] = [];
}