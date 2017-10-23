import { Directive, ElementRef, Input } from '@angular/core';
@Directive({
    selector: '[alphaNumeric]'
})
export class AlphaNumeric {
    constructor(el: ElementRef) {
        el.nativeElement.addEventListener('keydown', (e) => {
            const keyCode = (e.keyCode ? e.keyCode : e.which);
            console.log(keyCode);
            if ((keyCode > 47 && keyCode < 58) ||
                (keyCode > 64 && keyCode < 106) ||
                (keyCode > 36 && keyCode < 41) ||                
                (keyCode === 8) ||
                (keyCode === 46)) {
                return true;
            }
            e.preventDefault();
        })
    }
}