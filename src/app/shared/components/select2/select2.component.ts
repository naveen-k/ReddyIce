import { Select } from '../../interfaces/interfaces';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

declare var $: any;

@Component({
    template: `<select #select2 name="item" class="select2-container">
                    <option [value]="option.id" *ngFor="let option of options">{{option.label}}</option>
                </select>`,
    selector: 'select2',
    styles: [
        `.select2-container {
            width: 100%
        }
        `
    ]
})
export class Select2Component implements OnInit, AfterViewInit {

    _select: Select;

    select2: any;

    @ViewChild('select2') element: ElementRef;

    @Input()
    options: any[] = [];

    @Output()
    selectChange: EventEmitter<Select> = new EventEmitter();

    @Input()
    set select(val: Select) {
        this._select = val;
        if (val) {
            this.selectItem(val);
        }
        this.selectChange.emit(this._select);
    }

    get select(): Select {
        return this._select;
    }

    constructor() { };

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.select2 = $(this.element.nativeElement).select2({
            placeholder: 'Select an option',
            allowClear: true,
        }).on("select2:select", (e) => {
            const id = +e.params.data.id;
            this.select = this.options.filter((option) => {
                return option.id === id;
            })[0];
        }).on("select2:unselect", (e) => {
            this.select = null;
        })//.val(this.select.id);
    }

    selectItem(select: Select) {
        if (!this.select2) { return; }
        this.select2.val(select.id);
    }
}