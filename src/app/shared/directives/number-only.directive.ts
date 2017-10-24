import { Directive, ElementRef, Input } from '@angular/core';
@Directive({
    selector: '[numberOnly]',
})
export class NumberOnlyDirective {

    @Input()
    numberOnly: boolean = false;

    constructor(el: ElementRef) {
        el.nativeElement.addEventListener('keypress', (e) => {
            const keyCode = (e.keyCode ? e.keyCode : e.which);
            if ((keyCode > 47 && keyCode < 58) || (keyCode === 8)) {
                return true;
            }
            else if (this.numberOnly && keyCode === 46) { return true } // accept decimal value 
            e.preventDefault();
        });
    }
}
