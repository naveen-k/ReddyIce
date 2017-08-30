export interface ManaulTicket {
    TicketID: string;
    CustomerID: string;
    HHCustomerID: string;
    TripID: string;
    TicketTypeID: string;
    SaleTypeID: string;
    DNSImageID: string;
    DNSReasonID: string;
    PODImageID: string;
    ReceiverSignatureImageID: string;
    CreditCardTransactionID: string;
    TicketNumber: string;
    IsInvoice: string;
    DeliveryDate: string;
    PONumber: string;
    CashAmount: string;
    CheckAmount: string;
    CheckNumber: string;
    CreditCardAmount: string;
    ReceiverName: string;
    IsDexed: string;
    PrintedCopies: string;
    Notes: string;
    TaxAmount: string;
    IsPaperTicket: boolean;
    IsNoPayment: boolean;
    CardPaymentStatus: string;
    Created: string;
    CreatedBy: number;
    Modified: string;
    ModifiedBy: number;
    TicketStatusID: number;
    OrderID: number;
    BranchID: number;
    TicketDetail: TicketDetail;
    HHCustomer: {
        HHCustomerID: number;
    };
    PODImage: {
        PODImageID: number;
        Image: string;
    };
    Customer: Customer;
}
export interface Customer {
    CustomerID: number;
    CustomerName: string;
}
export interface TicketDetail {
    TicketDetailID: number;
    ProductID: number;
    Quantity: number;
    Rate: number;
    StartMeterReading: number;
    EndMeterReading: number;
    TaxPercentage: number;
    IsTaxable: boolean;
}
