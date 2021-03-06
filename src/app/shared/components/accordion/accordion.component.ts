import { Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'accordion',
  template: `
            <ng-content></ng-content>
          `,
  host: {
    'class': 'panel-group'
  },
  styleUrls : ['./accordion.component.scss'],
})
export class AccordionComponent {
  groups: AccordionGroupComponent[] = [];

  addGroup(group: AccordionGroupComponent): void {
    this.groups.push(group);
  }

  closeOthers(openGroup: AccordionGroupComponent): void {
    this.groups.forEach((group: AccordionGroupComponent) => {
      if (group !== openGroup) {
        group.isOpen = false;
      }
    });
  }

  removeGroup(group: AccordionGroupComponent): void {
    const index = this.groups.indexOf(group);
    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  }
}

@Component({
  selector: 'accordion-group',
  template: `
                <div class="accordion-panel" [ngClass]="{'panel-open': isOpen}">
                  <div class="panel-heading" (click)="toggleOpen($event)">
                    <h5 class="panel-title">
                      <a href tabindex="0"><span>{{heading}}</span></a>
                    </h5>
                   <i class="ion-plus-round icon-right pointer" [hidden]="isOpen"></i>
                   <i class="ion-minus-round icon-right pointer" [hidden]="!isOpen"></i>

                  </div>
                  <div class="panel-collapse" [hidden]="!isOpen">
                    <div class="panel-body">
                        <ng-content></ng-content>
                    </div>
                  </div>
                </div>
          `,
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionGroupComponent implements OnDestroy {
  private _isOpen: boolean = false;

  @Input() heading: string;

  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.accordion.closeOthers(this);
    }
  }

  get isOpen() {
    return this._isOpen;
  }

  constructor(private accordion: AccordionComponent) {
    this.accordion.addGroup(this);
  }

  ngOnDestroy() {
    this.accordion.removeGroup(this);
  }

  toggleOpen(event: MouseEvent): void {
    event.preventDefault();
    this.isOpen = !this.isOpen;
  }
}
