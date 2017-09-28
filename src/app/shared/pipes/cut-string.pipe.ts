import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'cutString',
})
export class CutStringPipe implements PipeTransform {
    transform(value: string, wordwise: boolean, max: number, tail: string = '...') {
        if (!value) { return ''; }

        // max = parseInt(max, 10);
        if (!max) { return value; }
        if (value.length <= max) { return value; }

        value = value.substr(0, max);
        if (wordwise) {
            let lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
                // Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    }
}
