import {Component} from '@angular/core';

@Component({
  selector: 'create-new-ticket',
  templateUrl: './create-ticket.component.html',
})
export class CreateTicketComponent {

  constructor() {
  }

  isChecked: boolean = false;
}
