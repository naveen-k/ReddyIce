import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'ticketType'
})
export class TicketTypePipe implements PipeTransform {
    transform(value: number, customer: any, ticketTypeId: number) {
        if (ticketTypeId === 29) {
            return 'DNS';
        } else if (ticketTypeId === 28) {
            return 'Payment Only';
        } else if (ticketTypeId === 30) {
            return 'Void';
        } else if (ticketTypeId === 110) {
            return 'Credit & Sale';
        } else if (customer.CustomerType === 20) {
            if (value) {
                return 'Sale';
            } else {
                return 'Credit';
            }
        } else if (customer.CustomerType === 22) {
            if (value) {
                return 'PBM - Sale';
            } else {
                return 'PBM - Cons';
            }
        } else {
            return 'PBS - Cons';
        }
    }
}
