import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Customer, DualListItem, MProducts } from '../../../../shared/interfaces/interfaces';
import { CustomerManagementService } from '../../customer-management.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.scss'],
})

export class CreateCustomerComponent implements OnInit {

    customer: Customer = <Customer>{};

    products: any[] = [];

    selectedProducts: DualListItem[] = [];

    addedProduct: MProducts[] = [];
    newlyAddedproduct: MProducts[] = [];

    keepSorted = true;
    // action: string = 'create';

    customerId: string;

    mode: number; // 1-Create Mode, 2-Edit Mode, 3-View Mode 
    addProductCheck: any =[];
    addNewProductCheck: any =[];

    constructor(protected service: CustomerManagementService,
        protected route: ActivatedRoute,
        protected router: Router,
        private notification: NotificationsService,
        protected modalService: NgbModal,
    ) {
        this.customerId = this.route.snapshot.params['customerId'];
        this.mode = +this.route.snapshot.data['mode'];
    }

    ngOnInit() {
        if (this.mode === 2 || this.mode === 3) {
            this.service.getCustomer(this.customerId).subscribe((response) => {
                this.customer = response.CustomerDetails;
                if(response.CustomerDetails.C_CustomerNumber_) {
                    this.customer.CustomerNumber = response.CustomerDetails.C_CustomerNumber_;
                }
                this.addedProduct = response.ProductDetail;
                this.addProductCheck = new Array(this.addedProduct.length);
                this.addProductCheck.fill(false);
            });
        }
        this.service.getExternalProducts().subscribe((response) => {
            this.products = response;
        });
    }
    addProduct() {
        if (this.mode === 1) {
            this.addProductCheck.fill(false);
            this.addedProduct.push({} as MProducts);
            this.addProductCheck.push(true);
            console.log("addedProduct ",this.addedProduct)
        } else {
            this.addProductCheck.fill(false);
            this.addNewProductCheck.fill(false);
            this.newlyAddedproduct.push({} as MProducts);
            this.addNewProductCheck.push(true);
        }
    }

    save() {
        if(this.validateCustomer(this.customer,this.newlyAddedproduct,this.addedProduct,this.mode)){
            //console.log("sdsa ---0-----", this.customer);
            if (this.mode === 2) {
                ///const mAddedProduct = this.addedProduct.concat(this.newlyAddedproduct);
                //this.customer.MappedProducts = mAddedProduct;
                this.customer.EditedProducts = this.addedProduct;
                this.customer.NewAddedProducts = this.newlyAddedproduct;
                console.log("this.customerId, this.customer ",this.customerId," :--> ", this.customer)
                this.service.updateCustomer(this.customerId, this.customer).subscribe((res) => {
                    if(res) {
                        this.notification.success('Customer Edited successfully');
                        this.router.navigate(['../../list'], { relativeTo: this.route });
                    }
                }, (err) => {
                    this.notification.success('API Error');
                });

            } else {
                this.customer.MappedProducts = this.addedProduct;
                this.customer.EditedProducts = this.addedProduct;
                this.customer.NewAddedProducts = this.addedProduct;
                console.log("this.customerId ", this.customer)
                this.service.createCustomer(this.customer).subscribe((res) => {
                    if(res){
                        this.notification.success('Customer Added successfully');
                        this.router.navigate(['/pages/customer-management/list'], { relativeTo: this.route });
                    }
                }, (err) => {
                    this.notification.success('API Error');
                });
            }
        }
    
    }

    deactivateMappedProduct(mprod) {
        const index = this.addedProduct.indexOf(mprod);
        if (this.mode === 2 || index > -1) {
            this.addedProduct.splice(index, 1);
            this.addedProduct = this.addedProduct;

        }
    }

    productChangeHandler(mprod) {        
        const product = this.addedProduct.filter(t => t.ExternalProductID === mprod.ExternalProductID);
        const product1 = this.newlyAddedproduct.filter(t => t.ExternalProductID === mprod.ExternalProductID);
        if (product.length === 2 || product1.length === 2 ) {
            mprod.ExternalProductID = '';
            const activeModal = this.modalService.open(ModalComponent, {
                size: 'sm',
                backdrop: 'static',
            });
            activeModal.componentInstance.BUTTONS.OK = 'OK';
            activeModal.componentInstance.modalHeader = 'Warning!';
            activeModal.componentInstance.modalContent = `Product already selected! You cannot select same product again.`;
            activeModal.componentInstance.closeModalHandler = (() => {
            });
            return;
        } else {
            mprod.Price = this.products.filter(prod => +prod.ExternalProductId === +mprod.ExternalProductID)[0].ProductPrice;
        }
    }
    validateCustomer(customer,newlyAddedproduct,addedProduct,mode): boolean {
        if (!customer.CustomerNumber) {
            this.notification.error('Customer Number is mandatory!!!');
            return false;
        } else if (!customer.CustomerName) {
            this.notification.error('Customer Name is mandatory!!!');
            return false;
        } else if (!customer.CustType) {
            this.notification.error('Customer Type is mandatory!!!');
            return false;
        } else if (!customer.PaymentType) {
            this.notification.error('Payment Type is mandatory!!!');
            return false;
        } else if (customer.IsTaxassble && !customer.TaxPercentage) {
            this.notification.error('Tax Percentage is mandatory!!!');
            return false;
        } else if (customer.IsDex && !customer.Chain) {
            this.notification.error('Chain Number is mandatory!!!');
            return false;
        } else if (customer.IsDex && !customer.DUNSNumber) {
            this.notification.error('DUNS Number is mandatory!!!');
            return false;
        } else if (!customer.Address) {
            this.notification.error('Customer Address is mandatory!!!');
            return false;
        } else if (!customer.State) {
            this.notification.error('Customer State is mandatory!!!');
            return false;
        } else if (!customer.City) {
            this.notification.error('Customer City is mandatory!!!');
            return false;
        } else if (!customer.ZipCode) {
            this.notification.error('Customer ZipCode is mandatory!!!');
            return false;
        } else if (!customer.PrimaryContact) {
            this.notification.error('Customer Primary Contact is mandatory!!!');
            return false;
        } else if (!customer.Phone) {
            this.notification.error('Customer Phone is mandatory!!!');
            return false;
        } else if (!customer.EmailID) {
            this.notification.error('Customer EmailID is mandatory!!!');
            return false;
        } 
        else if(mode ===1 && (addedProduct.length === undefined || addedProduct.length === 0)) {
            this.notification.error('Atleast one product is mandatory!!!');
            return false;
        } else if(mode ===1 && addedProduct.length >0) {
            console.log("addedProduct ----------------------",addedProduct)
            if(addedProduct){
                var check = true;
                addedProduct.forEach(element => {
                    console.log("element.ExternalProductID || ! element.Price" ,element.ExternalProductID , element.Price);
                    if(!element.ExternalProductID || !element.Price){
                        check = false;
                    }
                });
                if(!check){
                    this.notification.error('Product Name and its Price is mandatory!!!');
                }
                return check;
            } else {
                console.log("succe1");
                return true;
            }
            
        }  else if(mode ===2 && newlyAddedproduct.length >0) {
            if(newlyAddedproduct){
                var check = true;
                newlyAddedproduct.forEach(element => {
                    if(!element.ExternalProductID || !element.Price){
                        
                        check = false;
                    }
                });
                if(!check){
                    this.notification.error('Product Name and its Price is mandatory!!!');
                }
                console.log("succe0");
                return check;
            } else {
                return true;
            }
            
        } else {
            console.log("succe2");
            return true;
        }
    }
    editProductPrice(mode,index) {
        console.log("mode ----- ",mode," index---",index);
        if (mode === 1) {
            this.addProductCheck.fill(false);
            this.addProductCheck[index] = true;
        } else {
            this.addProductCheck.fill(false);
            this.addProductCheck[index] = true;
            this.addNewProductCheck.fill(false);
            this.addNewProductCheck[index]= true;
        }
       
    }

}
