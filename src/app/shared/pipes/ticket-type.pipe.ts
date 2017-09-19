import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'ticketType'
})
export class TicketTypePipe implements PipeTransform {
    transform(value: number, customer: any) {
        if (customer.Customer.CustomerType === 20) {
            if (customer.TicketTypeID === 22) {
                return 'DSD - Sale';
            } else {
                return 'DSD - Credit';
            }
        } else if (customer.Customer.CustomerType === 22) {
            if (customer.TicketTypeID === 22) {
                return 'PBM - Sale';
            } else {
                return 'PBM - Consignment';
            }
        } else {
            return 'PBS - Consignment'
        }
    }
}
