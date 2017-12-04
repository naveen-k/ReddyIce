import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyFormatter'
})
export class CurrencyFormatter implements PipeTransform {
    transform(value: any, symbol:boolean=true) {
        if (!value) { value = 0 }
        if (value < 0) {
            value = `-$${-value}`;
         }
        else {
            value = `$${value}`;
        }

        if (value.indexOf(".") == -1) {
            return `${value}.00`;
        }
        value = value + '00';
        if(symbol){
            return value.substring(0, value.indexOf('.') + 3);
        }else{
            var temp= (value.substring(0, value.indexOf('.') + 3)).replace('$','');
            return temp;
        }
        
    }
}