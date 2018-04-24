import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'ticketType'
})
export class TicketTypePipe implements PipeTransform {
    transform(value: number, customer: any, ticketTypeId: number, Is_PBM_DSD: number = 0) {
        if (ticketTypeId === 29) {
            return 'DNS'
        } else if (ticketTypeId === 28) {
            return 'Payment Only'
        } else if (ticketTypeId === 30) {
            return 'Void'
        } else if (ticketTypeId === 110) {
            return 'Sale & Credit';
        } else if (customer.CustomerType === 20) {
            if (ticketTypeId === 26) {
                return 'Sale';
            } else {
                return 'Credit';
            }
        } else if (customer.CustomerType === 22) {
            if (value && ticketTypeId === 26) {
                return Is_PBM_DSD === 1 ? 'Sale' : 'PBM - Sale';
            } else if (value && ticketTypeId === 27) {
                Is_PBM_DSD === 1 ? 'Credit' : 'PBM - Credit';
            } else {
                return 'PBM - Cons';
            }
        } else {
            return 'PBS - Cons';
        }
    }
}
