export interface UserDetails {
  UserId: string;
  UserName: string;
  FirstName: string;
  LastName: string;
  Phone: number;
  EmailID: string;
  IsDistributor: boolean;
  IsActive: boolean;
  Role: UserRole;
  Distributor?: UserDistributor;
  MenuOptions: UserMenuOptions[];
}

export interface UserDistributor {
  DistributorMasterId: number;
  DistributorName: string;
}
export interface UserRole {
  RoleId: number;
  RoleName: string;
}

export interface UserMenuOptions {
  Key: string;
  DisplayValue: string;
}
