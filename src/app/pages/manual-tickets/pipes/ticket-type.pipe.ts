import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';
import { Pipe } from '@angular/core';
@Pipe({
    name: 'ticketType'
})
export class TicketTypePipe implements PipeTransform {
    transform(value: number) {
        if (value === 22) {
            return 'Sale';
        } else if (value === 23) {
            return 'Credit';
        }
        return 'Consignment';
    }
}
