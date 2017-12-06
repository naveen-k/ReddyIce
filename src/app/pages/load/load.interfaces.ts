export interface LoadModel {
      
    LoadID: number;
    BranchID: number;
    DriverID: number;
    DeliveryDate: Date;
    TripID: number;
    TripCode: number;
    PalletsIssued: number;
    TruckNumber: number;
    Created: Date;
    CreatedBy: number;
    Modified:Date;
    ModifiedBy:number;
    loaddetails:LoadProduct;
}
export interface LoadProduct {
  LoadDetailID:number;
  LoadID:number;
  ProductID:number;
  Load1: number;
  Load2: number;
  Load3: number;
  Load4: number;
  Created: Date;
  CreatedBy: number;
  Modified: Date;
  ModifiedBy:number;
  
}

