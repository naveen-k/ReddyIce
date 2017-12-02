import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyFormatter'
})
export class CurrencyFormatter implements PipeTransform {
    transform(value: any) {
        if (!value) { value = 0 };
        value = `$${value}`;

        if (value.indexOf(".") == -1) {
            return `${value}.00`;
        }
        value = value + '00'
        return value.substring(0, value.indexOf('.') + 3);
    }
}