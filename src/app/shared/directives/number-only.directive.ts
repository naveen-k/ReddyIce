import { Directive, HostListener, ElementRef, OnInit, EventEmitter, Output, Input } from "@angular/core";
@Directive({
    selector: '[numberOnly]',
})
export class NumberOnlyDirective {
    private el: any;
    @Input()
    numberOnly: boolean = false;
    @Output() ngModelChange = new EventEmitter();

    constructor(private elementRef: ElementRef) {
        this.el = this.elementRef.nativeElement;
        this.el.addEventListener('keypress', (e) => {
            const keyCode = (e.keyCode ? e.keyCode : e.which);
            if (this.numberOnly && keyCode === 46 && e.target.value.indexOf(".") < 0) { // check for decimal
                return true;
            }
            else if ((keyCode > 47 && keyCode < 58) || (keyCode === 8)) {
                return true;
            }
            e.preventDefault();
        });
    }

    ngOnInit() {
        this.el.value = this.el.value;
    }

    @HostListener("keyup", ["$event.target.value"])
    keyup(value) {
        if (!this.numberOnly) {
            return;
        }
        if (this.numberOnly && value.indexOf(".") >= 0 && value.split(".")[1].length > 2) {
            let result = value.substring(0, value.indexOf(".") + 3);
            this.ngModelChange.emit(result);
        }
    }

    @HostListener("focus", ["$event.target.value"])
    focus(value) {
        if (!this.numberOnly) {
            return;
        }
        if ((parseFloat(value)).toFixed(2) == '0.00') {
            this.el.value = '';
            this.ngModelChange.emit(this.el.value);
        }
    }

    @HostListener("focusout", ["$event.target.value"])
    focusout(value) {
        if (!this.numberOnly) {
            return;
        }
        if (value == '' || value == '.') {
            this.el.value = '0.00';
            this.ngModelChange.emit(this.el.value);
        } else {
            var result = Number(value);
            var res = value.split(".");
            if (value.indexOf('.') === -1) {
                let r = result.toFixed(2);
                value = r.toString();
            } else if (res[1].length < 3) {
                let r = result.toFixed(2);
                value = r.toString();
            }
            this.el.value = value;
            this.ngModelChange.emit(this.el.value);
        }
    }
}
