import {
    Component,
    AfterViewInit,
    ElementRef,
    ViewChild,
    HostListener,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import { NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker-input";

@Component({
    selector: 'date-picker',
    template: `
        <div #datePickerContainer>  
            <table>   
                <tr>
                    <td>
                        <input style="width:100%" class="form-control" 
                        [firstDayOfWeek]="7" placeholder="yyyy-mm-dd" 
                        name="dp" ngbDatepicker #d="ngbDatepicker" 
                        [(ngModel)]='dateModel'
                        (ngModelChange)="changeHandler()"
                        [maxDate]="maxDate"
                        [minDate]="minDate"
                        (click)="d.toggle()"
                        disabled>
                    </td>
                    <td>
                        <button class="input-group-addon" (click)="d.toggle()"  type="button">
                            <i class="ion-calendar"></i>
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    `,
    styles: [
        `
        :host{
            width:100%;
        }
        table {
            width: 100%;
        }
        input {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            z-index: 0 !important;
        }
        button {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            height: 32px;
        }
        `
    ]

})
export class DatePicker {

    @ViewChild('datePickerContainer') datePickerContainer: ElementRef;

    @ViewChild('d') d: NgbInputDatepicker;

    @Input()
    dateModel: any;

    @Output()
    dateModelChange: EventEmitter<any[]> = new EventEmitter();


    @Input()
    maxDate: any;

    @Input()
    minDate: any;

    changeHandler(){
        this.dateModelChange.emit(this.dateModel);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(e) {
        if (!(this.datePickerContainer.nativeElement as HTMLElement).contains(e.target)) {
            this.d.close();
        }
    }
}