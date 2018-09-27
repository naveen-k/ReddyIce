import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyFormatter'
})
export class CurrencyFormatter implements PipeTransform {
    transform(value: any, symbol:boolean=true) {
		//console.log(value);
		var multiplier = Math.pow(10, 2);
  
        if (!value) { value = 0 }
        if (value < 0) {
			//value = parseFloat(value).toFixed(2);
			 value = Math.round(value * multiplier) / multiplier;
            value = `-$${-value}`;
         }
        else {
			 value = Math.round(value * multiplier) / multiplier;
            value = `$${value}`;
        }

        if (value.indexOf(".") == -1) {
            if(symbol){
            return `${value}.00`;
            } else {
                return `${value.replace('$','')}.00`;
            }
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