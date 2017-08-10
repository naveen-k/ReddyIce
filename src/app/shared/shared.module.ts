import { GenericSort } from './pipes/generic-sort.pipe';

import { CommonModule } from '@angular/common';
import { AccordionGroupComponent, AccordionComponent } from './components/accordion/accordion.component';

import { GenericFilter } from './pipes/generic-filter.pipe';
import { NgModule } from '@angular/core';
@NgModule({
    declarations: [GenericFilter, AccordionComponent, AccordionGroupComponent, GenericSort],
    exports: [GenericFilter, AccordionComponent, AccordionGroupComponent, GenericSort],
    imports: [CommonModule],
})
export class SharedModule {

}