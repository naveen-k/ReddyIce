// import { Directive, ElementRef, Input } from '@angular/core';
// @Directive({
//     selector: '[numberDecimal]',
// })
// export class NumberDecimalDirective {

//     @Input()
//     numberDecimal: boolean = false;

//     constructor(el: ElementRef) {
//         el.nativeElement.addEventListener('keypress', (e) => {
//             let value = el.nativeElement.value;  
//             value = value.replace(/[^0-9\.]/g, '')  
//             let findsDot = new RegExp(/\./g)  
//             let containsDot = value.match(findsDot);

//             if (containsDot != null && ([46, 110, 190].indexOf(e.which) > -1)) {  
//                 event.preventDefault();  
//                 return false;  
//             } 

//             // let reg_two_decimal= new RegExp('^\d+(\.\d{0,2})?$');
//             // if(!reg_two_decimal.test(value)) {
//             //     event.preventDefault();  
//             //     return false;  
//             // }

//             const keyCode = (e.keyCode ? e.keyCode : e.which);
//             if ((keyCode > 47 && keyCode < 58) || (keyCode === 8)) {
//                 return true;
//             }
//             else if (this.numberDecimal && keyCode === 46) { return true } // accept decimal value 
//             e.preventDefault();
//         });
//         el.nativeElement.addEventListener('focus', (e) => {
//             let value = el.nativeElement.value;  
//             if(value == '0.00'){
//                 el.nativeElement.value ='';
//             }
//         });
//         el.nativeElement.addEventListener('focusout', (e) => {
//             let value = el.nativeElement.value;  
//             if(value == '' || value == '.'){
//                 el.nativeElement.value ='0.00';
//             } else {
//                 var result = Number(value);
//                 var res = value.split(".");
//                 if(value.indexOf('.') === -1) {
//                     let r = result.toFixed(2);
//                     value = r.toString();
//                 } else if (res[1].length < 3) {
//                     let r = result.toFixed(2);
//                     value = r.toString();
//                 }
//                 el.nativeElement.value = value;              
//             }
//         });
//     }
// }


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

            // let reg_two_decimal= new RegExp('^\d+(\.\d{0,2})?$');
            // if(!reg_two_decimal.test(value)) {
            //     event.preventDefault();  
            //     return false;  
            // }

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

//   @HostListener("keypress", ["$event.target.value"])
//   keypress(value) {console.log(value,'aaaaaaaaa',this.el,this.el.which);
//         // value = value.replace(/[^0-9\.]/g, '')  
//         // let findsDot = new RegExp(/\./g)  
//         // let containsDot = value.match(findsDot);

//         // if (containsDot != null && ([46, 110, 190].indexOf(e.which) > -1)) {  
//         //     event.preventDefault();  
//         //     return false;  
//         // } 

//         // // let reg_two_decimal= new RegExp('^\d+(\.\d{0,2})?$');
//         // // if(!reg_two_decimal.test(value)) {
//         // //     event.preventDefault();  
//         // //     return false;  
//         // // }

//         // const keyCode = (e.keyCode ? e.keyCode : e.which);
//         // if ((keyCode > 47 && keyCode < 58) || (keyCode === 8)) {
//         //     return true;
//         // }
//         // else if (this.numberDecimal && keyCode === 46) { return true } // accept decimal value 
//         // e.preventDefault();     
//   }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
        if(value == '0.00'){
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

//   @HostListener("blur", ["$event.target.value"])
//   onBlur(value) {
//     this.el.value = this.cleanNumber(value); //"987654" ;//this.currencyPipe.transform(value);
//     this.ngModelChange.emit(this.el.value);
//   }

//   cleanNumber (value: number) {
//     return 8888888;
//   }

}