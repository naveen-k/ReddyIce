import { ManualTicket } from '../manaul-ticket.interfaces';
import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';
import { Pipe } from '@angular/core';
@Pipe({
    name: 'ticketFilter',
    pure: false,
})
export class TicketFilter implements PipeTransform {
    transform(array: ManualTicket[], filterField: string, value: number): ManualTicket[] {
        // console.log(array, filterField, value);
        if (!array || !value) {
            return [];
        }
        value = +value;
        return array.filter((ticket: ManualTicket) => {
            return filterField === 'Internal' ? ticket.UserID === +value
                : ticket.DistributorCopackerID === value;
        })
    }
}