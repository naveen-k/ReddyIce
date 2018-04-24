import { CurrencyFormatter } from './pipes/currency-pipe';
import { AlphaNumeric } from './directives/alpha-numeric.directive';
import { ConcatStringPipe } from './pipes/concat-string.pipe';
import { CutStringPipe } from './pipes/cut-string.pipe';
import { ListComponent } from './components/dual-list/list.component';
import { DualListComponent } from './components/dual-list/dual-list.component';
import { Select2Component } from './components/select2/select2.component';
import { TicketTypePipe } from './pipes/ticket-type.pipe';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { MinValueValidatorDirective } from './directives/min-value.directive';
import { SharedService } from './shared.service';
import { GenericSort } from './pipes/generic-sort.pipe';
import { HttpService } from './http.service';
import { CommonModule } from '@angular/common';
import { AccordionGroupComponent, AccordionComponent } from './components/accordion/accordion.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NumberDecimalDirective } from './directives/number-decimal.directive';
import { GenericFilter } from './pipes/generic-filter.pipe';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TruncateZero } from './pipes/truncateZero.pipe';
@NgModule({
    declarations: [
        GenericFilter,
        AccordionComponent,
        AccordionGroupComponent,
        GenericSort,
        PaginationComponent,
        MinValueValidatorDirective,
        NumberOnlyDirective,
        NumberDecimalDirective,
        TicketTypePipe,
        Select2Component,
        DualListComponent,
        ListComponent,
        CutStringPipe,
        AlphaNumeric,
        ConcatStringPipe,
        CurrencyFormatter,
        TruncateZero
    ],
    exports: [
        GenericFilter,
        AccordionComponent,
        AccordionGroupComponent,
        GenericSort,
        PaginationComponent,
        MinValueValidatorDirective,
        TicketTypePipe,
        Select2Component,
        DualListComponent,
        ListComponent,
        CutStringPipe,
        NumberOnlyDirective,
        NumberDecimalDirective,
        AlphaNumeric,
        ConcatStringPipe,
        CurrencyFormatter,
        TruncateZero
    ],
    entryComponents: [

    ],
    imports: [CommonModule,  FormsModule],
    providers: [HttpService, SharedService],
})
export class SharedModule {

}
