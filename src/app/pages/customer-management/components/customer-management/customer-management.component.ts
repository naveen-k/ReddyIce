import { NotificationsService } from 'angular2-notifications';
import { CustomerManagementService } from '../../customer-management.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../shared/user.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
@Component({
    templateUrl: './customer-management.component.html',
    styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent implements OnInit {

    customers: any[] = [];
    // selectedCustomer: any = [];
    isDistributorExist: boolean;
    userSubTitle: string = '';
    allcustomers: any = [];
    cutommers: any = [];
    paginationData: any = [];
    riCustomer: number = 3;
    isActtive: number = 3;
    showSpinner: boolean = false;
    constructor(
        protected service: CustomerManagementService,
        private route: ActivatedRoute,
        private userService: UserService,
        private notification: NotificationsService,
        private modalService: NgbModal,
    ) { }

    ngOnInit() {
        const userId = localStorage.getItem('userId') || '';
        this.userService.getUserDetails(userId).subscribe((response) => {
            this.isDistributorExist = response.IsDistributor;
            this.userSubTitle = (this.isDistributorExist) ? '-' + ' ' + response.Distributor.DistributorName : '';
        });
        this.getAllCustomers();
    }


    isRI = 3;
    sequenceChangeHandler() {
        console.log("this.riCustomer === 1 && this.isActtive ",this.riCustomer ,'--', this.isActtive);
        this.cutommers = this.customers.filter((p) => {
            if (this.riCustomer === 1 && this.isActtive === 1) {
                return p.IsRICustomer && p.Active;
            } else if (this.riCustomer === 1 && this.isActtive === 2) {
                return p.IsRICustomer && !p.Active;
            } else if (this.riCustomer === 1 && this.isActtive === 3) {
                return p.IsRICustomer;
            } else if (this.riCustomer === 2 && this.isActtive === 1) {
                return !p.IsRICustomer && p.Active;
            } else if (this.riCustomer === 2 && this.isActtive === 2) {
                return !p.IsRICustomer && !p.Active;
            } else if (this.riCustomer === 2 && this.isActtive === 3) {
                return !p.IsRICustomer;
            } else if (this.riCustomer === 3 && this.isActtive === 1) {
                return p.Active;
            } else if (this.riCustomer === 3 && this.isActtive === 2) {
                return !p.Active;
            } else if (this.riCustomer === 3 && this.isActtive === 3) {
                return true;
            }
        });
    }

    userType = 3;
    usertypeChangeHandler(sequence) {
        this.isActtive = sequence;
        this.cutommers = this.customers.filter((p) => {
            if (sequence === 1) {
                return p.Active;
            } else if (sequence === 2) {
                return !p.Active;
            }
            return true;
        });
    }

    getAllCustomers() {
        this.showSpinner = true;
        this.service.getAllCustomers().subscribe((res) => {
            this.customers = res;
            //this.cutommers = res;
            this.showSpinner = false;
            // console.log(this.customers);
            // this.riCustomer = 3;
            // this.isActtive = 3;
            this.sequenceChangeHandler();
            //this.usertypeChangeHandler(3);
        }, (err) => {
            // console.log(err);
        });
    }

    deleteCustomer(customerId) {
        const activeModal = this.modalService.open(ModalComponent, {
            size: 'sm',
            backdrop: 'static',
        });
        activeModal.componentInstance.BUTTONS.OK = 'OK';
        activeModal.componentInstance.showCancel = true;
        activeModal.componentInstance.modalHeader = 'Warning!';
        activeModal.componentInstance.modalContent = `Are you sure you want to inactive the customer?`;
        activeModal.componentInstance.closeModalHandler = (() => {
            const data = [{ 'CustomerType': 2, 'CustomerId': customerId }];
            this.service.deleteCustomer(data).subscribe((res) => {
                this.notification.success('Inactivated Succesfully!!');
                this.getAllCustomers();
            }, (err) => {
                this.notification.error('Error in Inactivating a customer!!');
            });

        });
    }
}
