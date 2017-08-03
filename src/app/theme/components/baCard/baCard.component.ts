import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'ba-card',
  templateUrl: './baCard.html',
  styleUrls: ['./baCard.scss'],
})
export class BaCard {
  @Input() cardTitle:String;
  @Input() baCardClass:String;
  @Input() cardType:String;
  @Input() showAddIcon:boolean;

  isExpanded = true;

  @Output() onClickAddIcon = new EventEmitter();

  onClickIcon() {
    this.isExpanded = !this.isExpanded;
    this.onClickAddIcon.emit(this.isExpanded);
  }
}
