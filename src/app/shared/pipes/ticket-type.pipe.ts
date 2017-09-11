import { PipeTransform } from '@angular/core/src/change_detection/pipe_transform';
import { Pipe } from '@angular/core';
@Pipe({
    name: 'ticketType'
})
export class TicketTypePipe implements PipeTransform {
    transform(value: number, customer: any) {
        if (customer.CustomerType === 20) {
            if (value) {
                return 'Sale';
            } else {
                return 'Credit';
            }
        } else if (customer.CustomerType === 22) {
            if (value) {
                return 'PBM - Sale';
            } else {
                return 'PBM - Consignment';
            }
        } else {
            return 'PBS - Consignment'
        }
    }
}
