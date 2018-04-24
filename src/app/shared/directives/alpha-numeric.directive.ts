import { Directive, ElementRef, Input } from '@angular/core';
@Directive({
    selector: '[alphaNumeric]'
})
export class AlphaNumeric {
    @Input()
    acceptSpace: boolean = false;

    constructor(el: ElementRef) {
        el.nativeElement.addEventListener('keypress', (e) => {
            const k = (e.keyCode ? e.keyCode : e.which);
            if (((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57))) {
                return true;
            }

            if (this.acceptSpace && k === 32) { return true; }
            e.preventDefault();
        });
    }
}
