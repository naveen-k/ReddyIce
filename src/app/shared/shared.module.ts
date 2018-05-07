import { CurrencyFormatter } from './pipes/currency-pipe';
import { AlphaNumeric } from './directives/alpha-numeric.directive';
import { ConcatStringPipe } from './pipes/concat-string.pipe';
import { CutStringPipe } from './pipes/cut-string.pipe';
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
import {PopupComponent} from './components/popup/popup.component';
import {MatFormFieldModule,MatDialogModule} from '@angular/material';
import {MaterialModule} from '../material.module';
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
        CutStringPipe,
        AlphaNumeric,
        ConcatStringPipe,
        CurrencyFormatter,
        TruncateZero,
        PopupComponent,
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
        CutStringPipe,
        NumberOnlyDirective,
        NumberDecimalDirective,
        AlphaNumeric,
        ConcatStringPipe,
        CurrencyFormatter,
        TruncateZero,
        PopupComponent
    ],
    entryComponents: [
        PopupComponent
    ],
    imports: [CommonModule,  FormsModule, MatFormFieldModule,MatDialogModule,MaterialModule],
    providers: [HttpService, SharedService],
})
export class SharedModule {

}
