import { CurrencyFormatter } from './pipes/currency-pipe';
import { ModelPopupComponent } from './components/model-popup/model-popup.component';
import { AlphaNumeric } from './directives/alpha-numeric.directive';
import { ConcatStringPipe } from './pipes/concat-string.pipe';
import { SelectComponent } from './components/multiple-select/multiple-select';
import { CutStringPipe } from './pipes/cut-string.pipe';
import { ListComponent } from './components/dual-list/list.component';
import { DualListComponent } from './components/dual-list/dual-list.component';
import { Select2Component } from './components/select2/select2.component';
import { TicketTypePipe } from './pipes/ticket-type.pipe';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { MinValueValidatorDirective } from './directives/min-value.directive';
import { SharedService } from './shared.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './components/modal/modal.component';
import { UserService } from './user.service';
import { GenericSort } from './pipes/generic-sort.pipe';
import { HttpService } from './http.service';
import { CommonModule } from '@angular/common';
import { AccordionGroupComponent, AccordionComponent } from './components/accordion/accordion.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NumberDecimalDirective } from './directives/number-decimal.directive';
import { GenericFilter } from './pipes/generic-filter.pipe';
import { NgModule } from '@angular/core';
@NgModule({
    declarations: [
        GenericFilter,
        AccordionComponent,
        AccordionGroupComponent,
        GenericSort,
        ModalComponent,
        PaginationComponent,
        MinValueValidatorDirective,
        NumberOnlyDirective,
        NumberDecimalDirective,
        TicketTypePipe,
        Select2Component,
        DualListComponent,
        ListComponent,
        CutStringPipe,
        SelectComponent,
        AlphaNumeric,
        ConcatStringPipe,
        ModelPopupComponent,
        CurrencyFormatter
    ],
    exports: [
        GenericFilter,
        AccordionComponent,
        AccordionGroupComponent,
        GenericSort,
        ModalComponent,
        PaginationComponent,
        MinValueValidatorDirective,
        TicketTypePipe,
        Select2Component,
        DualListComponent,
        ListComponent,
        CutStringPipe,
        NumberOnlyDirective,
        NumberDecimalDirective,
        SelectComponent,
        AlphaNumeric,
        ConcatStringPipe,
        ModelPopupComponent,
        CurrencyFormatter
    ],
    entryComponents: [
        ModalComponent,
        ModelPopupComponent
    ],
    imports: [CommonModule, NgbModalModule],
    providers: [HttpService, UserService, SharedService],
})
export class SharedModule {

}
