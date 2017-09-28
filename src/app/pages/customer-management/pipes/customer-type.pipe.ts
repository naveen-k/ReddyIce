import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'customerTypeToName'
})
export class CustomerTypeToNamePipe implements PipeTransform {
    transform(value: any) {
        if (!value) { return value; }
        switch (value) {
            case 20:
                value = 'DSD';
                break;
            case 21:
                value = 'PBS';
                break;
            case 22:
                value = 'PBM';
                break;
        }
        return value;
    }
}