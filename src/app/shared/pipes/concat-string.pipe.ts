import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'concat',
})
export class ConcatStringPipe implements PipeTransform {
    transform(value: any, columns: string ) {
        if (!value ) { return ''; }
        const data = value;
        let cstring =[];
        const keys = columns;
        data.find((val) => {
            if (typeof val === 'object') {
              
                cstring.push(val[keys]);
            }
            
        });
        return cstring.join(',');
    }
}
