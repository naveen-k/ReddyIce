import { Directive, ElementRef } from '@angular/core';
@Directive({
    selector: '[numberOnly]',
})
export class NumberOnlyDirective {
    constructor(el: ElementRef) {
        el.nativeElement.addEventListener('keydown', () => {
            alert('ss')
        });
    }
}
