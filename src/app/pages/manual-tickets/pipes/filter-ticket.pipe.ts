import { ManualTicket } from '../manaul-ticket.interfaces';
import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';
import { Pipe } from '@angular/core';
@Pipe({
    name: 'ticketFilter',
})
export class TicketFilter implements PipeTransform {
    transform(array: ManualTicket[], filterField: string, value: number): ManualTicket[] {
        if (!array || !value || !Array.isArray(array)) {
            return [];
        }
        value = +value;
        return array.filter((ticket: ManualTicket) => {
            if (filterField === 'Internal' && ticket.IsRIInternal) {
                if (value === 1) {
                    return ticket.UserID > 0;
                }
                return ticket.UserID === value;
            }
            return ticket.DistributorCopackerID === value;           
        });
    }
}
