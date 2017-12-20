import { Directive, HostListener, ElementRef, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Directive({ selector: "[numberDecimal]" })
export class NumberDecimalDirective implements OnInit {

  private el: any;
    @Input()
    numberDecimal: boolean = false;
  @Output() ngModelChange = new EventEmitter();

  constructor(
    private elementRef: ElementRef
  ) {
    this.el = this.elementRef.nativeElement;
        this.el.addEventListener('keypress', (e) => {
            let value = this.el.value;
            value = value.replace(/[^0-9\.]/g, '')  
            let findsDot = new RegExp(/\./g)  
            let containsDot = value.match(findsDot);

            if (containsDot != null && ([46, 110, 190].indexOf(e.which) > -1)) {  
                event.preventDefault();  
                return false;  
            } 

            const keyCode = (e.keyCode ? e.keyCode : e.which);
            if ((keyCode > 47 && keyCode < 58) || (keyCode === 8)) {
                return true;
            }
            else if (this.numberDecimal && keyCode === 46) { return true } // accept decimal value 
            e.preventDefault();
        });    
  }

  ngOnInit() {
    this.el.value = this.el.value;
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
        if((parseFloat(value)).toFixed(2) == '0.00'){
            this.el.value = '';
            this.ngModelChange.emit(this.el.value);
        }      
  }

  @HostListener("focusout", ["$event.target.value"])
  focusout(value) {
            if(value == '' || value == '.'){
                this.el.value = '0.00';
                this.ngModelChange.emit(this.el.value);  
            } else {
                var result = Number(value);
                var res = value.split(".");
                if(value.indexOf('.') === -1) {
                    let r = result.toFixed(2);
                    value = r.toString();
                } else if (res[1].length < 3) {
                    let r = result.toFixed(2);
                    value = r.toString();
                }
                this.el.value = value;   
                this.ngModelChange.emit(this.el.value);             
            }     
  }
}