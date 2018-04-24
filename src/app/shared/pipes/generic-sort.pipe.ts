import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort'
})
export class GenericSort implements PipeTransform {
    transform(array: any, sortField: string, isAsc: boolean): any {
        if (!array || !sortField) { return array; }
        array.sort((a: any, b: any) => {
            a = this.extractValue(a, sortField.split('.'));
            b = this.extractValue(b, sortField.split('.'));
            a = typeof a === 'string'? a.toLowerCase(): a; 
            b = typeof b === 'string'? b.toLowerCase(): b; 
            if (isAsc) {
                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (a > b) {
                    return -1;
                } else if (a < b) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
        return array;
    }

    extractValue(object: any, propertiesChain: Array<string>): any {
        for (let prop of propertiesChain) {
            object = object[prop];
        }
        return object;
    }
}
