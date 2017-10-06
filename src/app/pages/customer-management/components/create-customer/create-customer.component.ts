import { UserService } from '../../../../shared/user.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Customer, DualListItem, MapProducts } from '../../../../shared/interfaces/interfaces';
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

    addedProduct: MapProducts[] = [];
    newlyAddedproduct: MapProducts[] = [];

    keepSorted = true;
    // action: string = 'create';

    customerId: string;
    allStates: any = [];
    isCustNumberExist: boolean;
    isDistributorExist: boolean;
    userSubTitle: string = '';
    chains: any = [];

    mode: number; // 1-Create Mode, 2-Edit Mode, 3-View Mode 
    addProductCheck: any = [];
    addNewProductCheck: any = [];

    constructor(protected service: CustomerManagementService,
        protected route: ActivatedRoute,
        protected router: Router,
        private notification: NotificationsService,
        protected modalService: NgbModal,
        protected userService: UserService,
    ) {
        this.customerId = this.route.snapshot.params['customerId'];
        this.mode = +this.route.snapshot.data['mode'];
    }

    ngOnInit() {

        const userId = localStorage.getItem('userId') || '';
        this.userService.getUserDetails(userId).subscribe((response) => {
            this.isDistributorExist = response.IsDistributor;
            this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + response.Distributor.DistributorName : '';
        });

        this.service.getChain().subscribe((res) => {
            this.chains = res;
        }, (err) => { });


        if (this.mode === 2 || this.mode === 3) {
            this.service.getCustomer(this.customerId).subscribe((response) => {
                this.customer = response.CustomerDetails;
                if (response.CustomerDetails.C_CustomerNumber_) {
                    this.customer.CustomerNumber = response.CustomerDetails.C_CustomerNumber_;
                }
                this.addedProduct = response.ProductDetail;
               // console.log("this.addedProduct ------ ",this.addedProduct);
                this.addProductCheck = new Array(this.addedProduct.length);
                this.addProductCheck.fill(false);
            });
        }
        this.service.getExternalProducts().subscribe((response) => {
            this.products = response;
           // console.log(" this.products---------------", this.products);
        });
        this.service.getAllStates().subscribe((response) => {
            this.allStates = response;
        });
    }
    addProduct() {
        if (this.mode === 1) {
            this.addProductCheck.fill(false);
            this.addedProduct.push({} as MapProducts);
            this.addProductCheck.push(true);
            // console.log("addedProduct ", this.addedProduct)
        } else {
            this.addProductCheck.fill(false);
            this.addNewProductCheck.fill(false);
            this.newlyAddedproduct.push({} as MapProducts);
            this.addNewProductCheck.push(true);
        }
    }

    save() {
        if (this.validateCustomer(this.customer, this.newlyAddedproduct, this.addedProduct, this.mode)) {
            // console.log("sdsa ---0-----", this.customer);
            if (this.mode === 2) {
                ///const mAddedProduct = this.addedProduct.concat(this.newlyAddedproduct);
                // this.customer.MappedProducts = mAddedProduct;
                this.customer.EditedProducts = this.addedProduct;
                this.customer.NewAddedProducts = this.newlyAddedproduct;
                // console.log("this.customerId, this.customer ", this.customerId, " :--> ", this.customer)
                this.service.updateCustomer(this.customerId, this.customer).subscribe((res) => {
                    if (res) {
                        this.notification.success('Customer Edited successfully');
                        this.router.navigate(['../../list'], { relativeTo: this.route });
                    }
                }, (err) => {
                    //console.log("err ",err);
                    this.notification.error(err._body);
                });

            } else {
                this.customer.MappedProducts = this.addedProduct;
                this.customer.EditedProducts = this.addedProduct;
                this.customer.NewAddedProducts = this.addedProduct;
                // console.log("this.customerId ", this.customer)
                this.service.createCustomer(this.customer).subscribe((res) => {
                    if (res) {
                        this.notification.success('Customer Added successfully');
                        this.router.navigate(['/pages/customer-management/list'], { relativeTo: this.route });
                    }
                }, (err) => {
                    //console.log("err ",err);
                    this.notification.error(err._body);
                });
            }
        }

    }

    deactivateMappedProduct(mprod) {
        const index = this.addedProduct.indexOf(mprod);
        if (this.mode === 1 || index > -1) {
            this.addedProduct.splice(index, 1);
            this.addedProduct = this.addedProduct;
            this.addProductCheck.splice(index, 1);
        }
        const index2 = this.newlyAddedproduct.indexOf(mprod);
        if (this.mode === 2 || index2 > -1) {
            this.newlyAddedproduct.splice(index2, 1);
            this.newlyAddedproduct = this.newlyAddedproduct;
            this.addNewProductCheck.splice(index2, 1);
        }
    }

    productChangeHandler(mprod) {

        let mProdTemp = mprod.cProductId.split('-');
        const product = this.addedProduct.filter(t => t.cProductId === mprod.cProductId || t.ProductId === +mProdTemp[0]);
        const product1 = this.newlyAddedproduct.filter(t => t.cProductId === mprod.cProductId);
        if ((product.length + product1.length) === 2) {
            
            if (this.mode === 2){ product1.pop(); } else { product.pop(); }
           
            mprod.cProductId = '';
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
           /* mprod.ProductPrice = this.products.filter(prod => +prod.ProductId === +mprod.ProductId)[0].ProductPrice;
            mprod.ProductCode = this.products.filter(prod => +prod.ProductId === +mprod.ProductId)[0].ProductCode;
            mprod.IsInternal = this.products.filter(prod => +prod.ProductId === +mprod.ProductId)[0].IsInternal;
            mprod.DisplayName = this.products.filter(prod => +prod.ProductId === +mprod.ProductId)[0].DisplayName;
            mprod.ProductName = this.products.filter(prod => +prod.ProductId === +mprod.ProductId)[0].ProductName;
            mprod.ExternalProductId = this.products.filter(prod => +prod.ProductId === +mprod.ProductId)[0].ExternalProductId;
            mprod.ExternalCustomerId = this.products.filter(prod => +prod.ProductId === +mprod.ProductId)[0].ExternalCustomerId;
            mprod.IsActive = this.products.filter(prod => +prod.ProductId === +mprod.ProductId)[0].IsActive;*/
            let tempProd = this.products.filter(prod => +prod.ProductId === +mProdTemp[0] && prod.IsInternal === !!mProdTemp[1])[0];
            mprod.ProductId = tempProd.ProductId;
            mprod.ProductPrice = tempProd.ProductPrice;
            mprod.ProductCode = tempProd.ProductCode;
            mprod.IsInternal = tempProd.IsInternal;
            mprod.DisplayName = tempProd.DisplayName;
            mprod.ProductName = tempProd.ProductName;
            mprod.ExternalProductId = tempProd.ExternalProductId;
            mprod.ExternalCustomerId = tempProd.ExternalCustomerId;
            mprod.IsActive = tempProd.IsActive;
        }
        //console.log("this.addedProduct   -------",this.addedProduct);
    }
    validateCustomer(customer, newlyAddedproduct, addedProduct, mode): boolean {
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
        } else if (customer.IsDex && !customer.ChainID) {
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
        }else if (mode === 1 && (addedProduct.length === undefined || addedProduct.length === 0)) {
            this.notification.error('Atleast one product is mandatory!!!');
            return false;
        } else if (mode === 1 && addedProduct.length > 0) {
            // console.log("addedProduct ----------------------", addedProduct)
            if (addedProduct) {
                var check = true;
                addedProduct.forEach(element => {
                    // console.log("element.ExternalProductID || ! element.Price", element.ExternalProductID, element.Price);
                    if (!element.cProductId || !element.ProductPrice) {
                        check = false;
                    }
                });
                if (!check) {
                    this.notification.error('Product Name and its Price is mandatory!!!');
                }
                return check;
            } else {
                // console.log("succe1");
                return true;
            }

        } else if (mode === 2 && newlyAddedproduct.length > 0) {
            if (newlyAddedproduct) {
                var check = true;
                newlyAddedproduct.forEach(element => {
                    if (!element.cProductId || !element.ProductPrice) {

                        check = false;
                    }
                });
                if (!check) {
                    this.notification.error('Product Name and its Price is mandatory!!!');
                }
                // console.log("succe0");
                return check;
            } else {
                return true;
            }

        } else {
            // console.log("succe2");
            return true;
        }
    }
    editProductPrice(mode, index) {
        // console.log("mode ----- ", mode, " index---", index);
        if (mode === 1) {
            this.addProductCheck.fill(false);
            this.addProductCheck[index] = true;
        } else {
            this.addProductCheck.fill(false);
            this.addProductCheck[index] = true;
            this.addNewProductCheck.fill(false);
            this.addNewProductCheck[index] = true;
        }

    }

    isCutomerNumberExist(CustomerNumber) {

        this.service.isCustomerNumberExist(CustomerNumber).subscribe((response) => {
            this.isCustNumberExist = response;
            if (this.isCustNumberExist) {
                this.notification.error('Customer Number Already Exist!!');
            }
        });
    }

}
