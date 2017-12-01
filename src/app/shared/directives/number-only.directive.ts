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
            if (this.numberOnly && keyCode === 46 && e.target.value.indexOf(".") < 0) { // check for decimal
                return true;
            }
            else if ((keyCode > 47 && keyCode < 58) || (keyCode === 8)) {
                return true;
            }
            e.preventDefault();
        });

        el.nativeElement.addEventListener('keyup', (e) => {
            if (this.numberOnly && e.target.value.indexOf(".") >= 0 && e.target.value.split(".")[1].length > 2) {
                e.target.value = e.target.value.substring(0, e.target.value.indexOf(".") + 3);
            }
        })
    }
}
