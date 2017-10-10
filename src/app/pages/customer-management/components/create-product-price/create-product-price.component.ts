import { NotificationsService } from 'angular2-notifications';
import { selector } from 'rxjs/operator/multicast';
import { LocalDataSource } from 'ng2-smart-table';
import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { any } from 'codelyzer/util/function';
import { CustomerManagementService } from '../../customer-management.service';
import { MapProducts } from '../../../../shared/interfaces/interfaces';

@Component({
    templateUrl: './create-product-price.component.html',
    styleUrls: ['./create-product-price.component.scss'],
    selector: 'create-product-price',
})
export class CreateProductPriceComponent implements OnInit, AfterContentInit {

    private _product: any = {};
    isFormValid: boolean = true;
    isSuccess = false;
    @Input()
    productList:MapProducts[] = [];
    @Input()
    get product(): any {
        return this._product;
    }

    set product(val: any) {
        if (!Object.keys(val).length) {
            return;
        }
        this._product = val;
    }
    @Input() isNewProduct: boolean;
    @Input() formIsDirty: boolean;
   
    @Input()
    get action(): any {
        return this;
    }
    set action(values) {
        if (values === '') { return; }
        this.actionName = values;
        if (values == 'create') {
            this.isFormValid = true;
            
        }
        if (values == 'edit') {
            this.isFormValid = true;
           
        }
    }

    @Input()
    set mIOpen(val: boolean) {
        
    }

    @Input() productDetails: any;
    
    @Output() onSaveProduct: EventEmitter<any> = new EventEmitter();
    @Output() onUpdateProduct: EventEmitter<any> = new EventEmitter();
    @Output() closeNewProduct: EventEmitter<any> = new EventEmitter();

    @Output() formChanged = new EventEmitter();

    actionName: string;
    


    constructor(private cmService: CustomerManagementService, private notification: NotificationsService) { }


    toInt(num: string) {
        return +num;
    }

    ngAfterContentInit() {
       
    }
    onSubmit() {
        this.isSuccess = true;
        if (!this.validateProduct(this.product)) { this.isSuccess = false; return };
        
        this.isNewProduct ? this.onSaveProduct.emit(this.product) : this.onUpdateProduct.emit(this.product);
    }
    spaceRemoverFn(value) {
        this.product.ProductName = value.replace(/^\s+|\s+$/g, '');
    }
    validateProduct(product) {
        if(this.isProductExist(product) && this.actionName =='create') {
            this.notification.error('Product Name is already exist!!!');
            return false;
        }
        else if (!product.ProductName && this.action ==='create') {
            this.notification.error('Product Name is mandatory!!!');
            return false;
        } else if (!product.ProductPrice) {
            this.notification.error('Price is mandatory!!!');
            return false;
        }
        return true;
    }

    ngOnInit() {
        this.isFormValid = true;
    }

    changeHandler() {
      this.isFormValid = true;
      this.formIsDirty = false;
      setTimeout(this.formChanged.emit('changed'), 1000);
    }

    resetProduct() {
        this.product = {};
    }

    isAllFeildsChecked() {
        if (this.product.ProductPrice) {
            this.isFormValid = false;
        }
        else {
            this.isFormValid = true;
        }
    }
    isProductExist (product){
        var a = this.productList.filter(prod => prod.ProductName == product.ProductName).length >0;
        return a;
    }
}
