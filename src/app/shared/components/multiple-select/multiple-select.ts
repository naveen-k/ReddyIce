import { selector } from 'rxjs/operator/multicast';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
declare var $: any;
@Component({
    selector: 'reddy-select',
    template: `<select #select [disabled]="disabled"></select>`,
})
export class SelectComponent implements AfterViewInit {
    @ViewChild('select') select: ElementRef;

    elementRef: any;

    loading: true;

    @Input()
    selectAll: boolean = false;

    @Input()
    position: string = 'bottom';

    private _disabled: boolean = false;
    
    get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    set disabled(val: boolean) {
        this._disabled = val;
        this.enableDisable(val);
    }

    @Input()
    multiple: boolean = false;

    private _selected: any;
    @Input()
    set selected(value: any) {
        //if (value === 0) { console.log(value) };
        if (!value && value !== 0) { console.log('undefined', value); return; }
        if (!this.multiple && !(value instanceof Array)) { value = [value]; }
        this._selected = value;
        if (this.elementRef) {
            this.elementRef.multipleSelect('setSelects', this.selected);
        }
    }

    get selected() {
        return this._selected;
    }

    @Output()
    selectedChange: EventEmitter<any> = new EventEmitter();

    private _options: IOption[] = [] as IOption[];

    @Input()
    set options(value: IOption[]) {
        if (!value) { return; }
        this._options = value;
        setTimeout(this.initSelect());
    }

    get options(): IOption[] {
        return this._options;
    }

    ngAfterViewInit() {
        this.elementRef = $(this.select.nativeElement);

        this.elementRef.multipleSelect({
            filter: true,
            single: !this.multiple,
            onClose: this.onClose.bind(this),
            position: this.position,
            selectAll: this.selectAll,
            allSelected: false,
            onClick: this.onClose.bind(this)
        });
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
        });
    }

    initSelect() {
        if (!this.elementRef) { setTimeout(this.initSelect.bind(this)); return; }
        this.elementRef.empty();
        this.options.forEach((option) => {
            this.elementRef.append($('<option />', {
                value: option.value,
                text: option.label,
            }));
        });
        this.elementRef.multipleSelect('refresh');
        this.elementRef.multipleSelect('setSelects', this.selected);
    }

    enableDisable(disable: boolean) {
        if (this.elementRef) {
            if (disable) {                
                this.elementRef.multipleSelect('disable');
            } else {
                this.elementRef.multipleSelect('enable');
            }
        }
    }

}

export interface IOption {
    value: any;
    label: string;
    data?: any;
}