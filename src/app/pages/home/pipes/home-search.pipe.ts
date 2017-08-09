import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'homeSearch', pure: false })

export class HomeSearchPipe implements PipeTransform {
    transform(items: any, filter: string): any {        
        filter = filter.toLowerCase();
        return items && items.filter(function (item) {
             let customerName = item.customerName.toLowerCase();
             return customerName.indexOf(filter) >= 0;
        });
    }
}