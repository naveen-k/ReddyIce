import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';
import { Pipe } from '@angular/core';
@Pipe({
    name: 'ticketType'
})
export class TicketTypePipe implements PipeTransform {
    transform(value: number) {
        if (value === 20) {
            return 'Manual';
        } else if (value === 22) {
            return 'Handheld';
        }
        return value;
    }
}
