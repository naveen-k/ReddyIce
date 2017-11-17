import { ManualTicket } from '../manaul-ticket.interfaces';
import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';
import { Pipe } from '@angular/core';
@Pipe({
    name: 'isExistFilter',
})
export class IsExistFilter implements PipeTransform {
    transform(array: any[], filterField: string, value: number): boolean {
        var status = false ; 
        if (!array || !value || !Array.isArray(array)) {
            status =  true;
            return status;
        }
        value = +value;
        for(var i=0; i<array.length; i++){
            if(array[i][filterField] === value){
                status = true;
                break;
            }
         }

        return status
    }
}
