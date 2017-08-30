import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';
import { Pipe } from '@angular/core';
@Pipe({
    name: 'ticketStatus'
})
export class TicketStatusPipe implements PipeTransform {
    transform(value: number) {
        if (value === 23) {
            return 'Draft';
        } else if (value === 24) {
            return 'Submitted';
        } else if (value === 25) {
            return 'Approved';
        }
        return value;
    }
}
