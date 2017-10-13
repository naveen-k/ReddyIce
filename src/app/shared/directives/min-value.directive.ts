import { Directive, ElementRef, Input } from '@angular/core';
@Directive(
    {
        selector: '[minValue]'
    },
)
export class MinValueValidatorDirective {
    @Input()
    minValue: number;
    constructor(el: ElementRef) {
        el.nativeElement.addEventListener('blur', () => {
            if (+el.nativeElement.value < +this.minValue) {
                el.nativeElement.style.border = '1px solid red';
                return;
            }
            el.nativeElement.style.border = '';
        });
    }
}
