import {Component} from '@angular/core';

@Component({
  selector: 'create-new-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
})
export class CreateTicketComponent {

  constructor() {
  }

  isChecked: boolean = false;
}
