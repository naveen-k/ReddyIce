import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncateZero'
})
export class TruncateZero implements PipeTransform {
    transform(value: any, symbol:boolean=true) {
        if (!value) { value = 0 }
        if (value < 0) {
            value = `-$${-value}`;
         }
        else {
            value = `$${value}`;
        }

        if (value.indexOf(".") == -1) {
            if(symbol){
            return `${value}.00000`;
            } else {
                return `${value.replace('$','')}.00000`;
            }
        }
        value = value + '00000';
        if(symbol){
            return value.substring(0, value.indexOf('.') + 6);
        }else{
            var temp= (value.substring(0, value.indexOf('.') + 6)).replace('$','');
            return temp;
        }
        
    }
}