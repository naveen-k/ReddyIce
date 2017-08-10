import { CommonModule } from '@angular/common';
import { AccordionGroupComponent, AccordionComponent } from './components/accordion/accordion.component';

import { GenericFilter } from './pipes/generic-filter.pipe';
import { NgModule } from '@angular/core';
@NgModule({
    declarations: [GenericFilter, AccordionComponent, AccordionGroupComponent],
    exports: [GenericFilter, AccordionComponent, AccordionGroupComponent],
    imports: [CommonModule],
})
export class SharedModule {

}
