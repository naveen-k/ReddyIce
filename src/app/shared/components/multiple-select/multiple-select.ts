import { selector } from 'rxjs/operator/multicast';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
declare var $: any;
@Component({
    selector: 'reddy-select',
    template: `<select #select></select>`,
})
export class SelectComponent implements AfterViewInit {
    @ViewChild('select') select: ElementRef;

    elementRef: any;

    @Input()
    multiple: boolean = false;

    private _selected: any;
    @Input()
    set selected(value: any) {
        if (!value) { return; }
        if (!this.multiple && !(value instanceof Array)) { value = [value] };        
        this._selected = value;
    }

    get selected() {
        return this._selected;
    }

    @Output()
    selectedChange: EventEmitter<any> = new EventEmitter()

    private _options: Array<IOption> = [] as Array<IOption>;

    @Input()
    set options(value: Array<IOption>) {
        this._options = value;
        if (value.length) {
            setTimeout(this.initSelect())
        }
    }

    get options(): Array<IOption> {
        return this._options;
    }

    ngAfterViewInit() {
        this.elementRef = $(this.select.nativeElement);

        this.elementRef.multipleSelect({
            filter: true,
            single: !this.multiple,
            onClose: this.onClose.bind(this),
        });
        setTimeout(() => {
            this.elementRef.next().css('width', '100%');
        })
    }

    onClose() {
        setTimeout(() => {
            let selected = this.elementRef.multipleSelect('getSelects');
            if (!this.multiple) {
                selected = selected[0];
                if (!isNaN(selected)) {
                    selected = +selected;
                }
            }
            if (this.selected === selected) { return; }
            this.selectedChange.emit(selected)
        })
    }

    initSelect() {
        this.options.forEach((option) => {
            this.elementRef.append($("<option />", {
                value: option.value,
                text: option.label,
            }))
        })
        this.elementRef.multipleSelect("refresh");
        this.elementRef.multipleSelect('setSelects', this.selected);
    }
}

interface IOption {
    value: any;
    label: string;
    data?: any;
}