
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filter',
})
export class GenericFilter implements PipeTransform {
    transform(value: any, searchString: any, columns: string[], dataToFilter?: any ) {
        if (!value || !searchString) { return value; }
        const data = dataToFilter || value;
        return data.filter((val) => {
            if (typeof val === 'object') {
                const keys = columns || Object.keys(val);
                let flag = false;
                for (let i=0; i < keys.length; i++) {
                    if (`${val[keys[i]]}`.toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
                        flag = true;
                        break;
                    }
                }
                return flag;
            }
            return `${val}`.toLowerCase().indexOf(searchString.toLowerCase()) >= 0;
        });
    }
}
